import { json } from '@sveltejs/kit';
import type { SchematicParseErrorJSON, SchematicParseJSON } from '@/interfaces/json';
import { parseText } from '@/server/body_parsing';
import type { RequestHandler } from './$types';
import { Schematic } from 'mindustry-schematic-parser';

interface SchematicParseJSON2 extends SchematicParseJSON {
  powerBalance: number;
  powerConsumption: number;
  powerProduction: number;
  requirements: object;
}

class SchematicSizeError extends Error {}
export const POST: RequestHandler = async ({ request }) => {
  const text: string = (await parseText(request)) ?? (await request.json()).text;

  if (!text || text === '') {
    return json(
      {
        error: "This isn't a valid schematic",
      },
      {
        status: 400,
      },
    );
  }
  try {
    const decoded = decodeURIComponent(text);
    const schematic = Schematic.decode(decoded);
    const maxSize = 90;
    if (schematic.width > maxSize || schematic.height > maxSize) {
      const { height, width } = schematic;
      throw new SchematicSizeError(
        `The schematic size (${width}x${height}) is bigger than the allowed size (${maxSize}x${maxSize})`,
      );
    }
    const { powerBalance, powerConsumption, powerProduction, requirements } = schematic;
    const body: SchematicParseJSON2 = {
      name: schematic.name,
      description: schematic.description,
      powerBalance,
      powerConsumption,
      powerProduction,
      requirements,
      image: (await schematic.render()).toBuffer().toString('base64'),
    };
    return json(body);
  } catch (error) {
    let status = 500;
    let message: string | undefined;
    if (error instanceof Error) {
      if (error.message.includes('valid')) status = 400;
      else if (error instanceof SchematicSizeError) {
        status = 400;
      }
      ({ message } = error);
    } else if (typeof error === 'string') {
      if (error.includes('valid')) status = 400;
    }
    const body: SchematicParseErrorJSON = {
      error: { message },
    };
    return json(body, { status });
  }
};
