import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/userController.js';
const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/:userId', getProfile);
router.put('/:userId', updateProfile);
export default router;
//# sourceMappingURL=userRoutes.js.map