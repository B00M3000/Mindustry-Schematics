import type { ItemCost } from 'mindustry-schematic-parser';
import mongoose from 'mongoose';

export type Votes = Record<string, -1 | 1>;

export interface SchematicDocData {
  creator_id: string;
  description: string;
  // eslint-disable-next-line camelcase
  encoding_version: string;
  image: { Data: Buffer; ContentType: string };
  name: string;
  powerConsumption: number;
  powerProduction: number;
  requirements: ItemCost;
  tags: string[];
  text: string;
  views: number;
  votes: Votes;
}


const schema = new mongoose.Schema<SchematicDocData>(
  {
    name: { type: String, required: true },
    creator_id: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },

    image: { Data: Buffer, ContentType: String },
    requirements: { type: Object, required: true },
    powerProduction: { type: Number, required: true },
    powerConsumption: { type: Number, required: true },

    text: { type: String, required: true },

    views: { type: Number, required: true, default: 0 },

    encoding_version: { type: String, required: true },

    votes: { type: Object, required: true, default: {} }
  },
  { timestamps: true },
);

export type SchematicDocument = mongoose.HydratedDocument<SchematicDocData>;

export const SchematicSchema: mongoose.Model<SchematicDocData> =
  mongoose.models.Schematics || mongoose.model('Schematics', schema);
