import type { SchematicDocument } from '../schemas/Schematic';
import type express from 'express';

export interface SchematicRequest extends express.Request<any> {
  schematic: SchematicDocument;
}
