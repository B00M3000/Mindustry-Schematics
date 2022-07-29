import type { LeanDocument } from 'mongoose';
import type { SchematicChangeDocument, SchematicDocument } from '../server/mongo';
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

type ChangeMode = 'delete' | 'modify';
export type SchematicChangeInfoJSON = Pick<SchematicChangeDocument, 'id' | '_id'> & {
  mode: ChangeMode;
  name: string;
};

export interface SchematicChangeJSON {
  change: LeanDocument<SchematicChangeDocument>;
  mode: ChangeMode;
  creator_id: string;
  original?: SchematicJSON | null;
  differentImages: boolean;
}
