import { Router } from 'express';
const router = Router();

router.use('/schematics', require('./schematics'));

export default router;
