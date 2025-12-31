import { Router } from 'express';
import { getPlans, updatePlanStatus } from '../controllers/planController.js';

const router = Router();

router.get('/:userId', getPlans);
router.put('/:planId', updatePlanStatus);

export default router;
