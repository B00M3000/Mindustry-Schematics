import { Router } from 'express';
import schematicsRouter from './schematics';
import tutorialRouter from './tutorials';
const router = Router();

router.use('/schematics', schematicsRouter);
router.use('/tutorials', tutorialRouter);

export default router;
