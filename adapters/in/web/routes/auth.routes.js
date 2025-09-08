import { Router } from 'express';

export default function createAuthRoutes(authController) {
  const router = Router();

  router.post('/register', authController.register.bind(authController));
  router.post('/login', authController.login.bind(authController));

  return router;
}