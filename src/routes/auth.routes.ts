import { Router, Request, Response, RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { IUser } from '../models/user.model';

interface AuthRequest extends Request {
  user?: IUser;
}

const router = Router();

// Public routes
router.post('/register', AuthController.register as RequestHandler);
router.post('/login', AuthController.login as RequestHandler);

// Protected route example
router.get('/profile', AuthController.auth as RequestHandler, (req: AuthRequest, res: Response) => {
  res.send(req.user);
});

export default router;  