import type { LeanDocument } from 'mongoose';
import type { SchematicDocument } from '@/schemas/Schematic';
export type SchematicJSON = Omit<LeanDocument<SchematicDocument>, 'image'>;
export type BasicSchematicJSON = Pick<
  LeanDocument<SchematicDocument>,
  '_id' | 'creator' | 'name' | 'text'
>;
export interface SchematicQueryJSON {
  skip: number;
  query: string;
  page: number;
  pages: number;
  documents: number;
  schematics: BasicSchematicJSON[];
  tags: string;
  mode: 'creator' | 'name';
}

export interface SchematicParseJSON {
  name: string;
  description: string;
  image: string;
}
export interface SchematicParseErrorJSON {
  error: {
    message?: string;
  };
}
