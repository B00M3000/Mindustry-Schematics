import type { LeanDocument } from 'mongoose';
import type {
  SchematicChangeDocument,
  SchematicDocument,
  UserDocument,
} from '../server/mongo';
export type SchematicJSON = Omit<LeanDocument<SchematicDocument>, 'image'>;
export type BasicSchematicJSON = Pick<
  LeanDocument<SchematicDocument>,
  '_id' | 'creator_id' | 'name' | 'text' | 'votes'
>;

export interface PaginatedQueryJSON {
  skip: number;
  page: number;
  pages: number;
  documents: number;
}

export interface SchematicQueryJSON extends PaginatedQueryJSON {
  query: string;
  schematics: BasicSchematicJSON[];
  tags: string;
}

export interface UserSchematicQueryJSON extends PaginatedQueryJSON {
  schematics: BasicSchematicJSON[];
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

export interface SchematicChangeInfoQueryJSON extends PaginatedQueryJSON {
  changes: SchematicChangeInfoJSON[];
}

export interface SchematicChangeJSON {
  change: LeanDocument<SchematicChangeDocument>;
  mode: ChangeMode;
  creator_id: string;
  original?: SchematicJSON | null;
  differentImages: boolean;
}

export type BasicUserJSON = Pick<
  LeanDocument<UserDocument>,
  'access' | 'avatar_url' | 'verified' | 'id' | 'username'
> & {
  id: string;
};
