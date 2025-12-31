import { Router } from 'express';
import { register, login, getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';

const router = Router();

router.get('/all', getAllUsers);
router.post('/register', register);
router.post('/login', login);
router.get('/:userId', getProfile);
router.put('/:userId', updateProfile);

export default router;
