import { SchematicDocument } from '../schemas/Schematic';
import express from 'express';

export interface SchematicRequest extends express.Request<any> {
  schematic: SchematicDocument;
}
