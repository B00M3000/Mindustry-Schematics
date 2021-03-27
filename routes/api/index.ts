import { Router } from 'express';
import schematicsRouter from './schematics';
const router = Router();

router.use('/schematics', schematicsRouter);

export default router;
