import { AuthController } from './AuthController';
import { Rocket } from '../../app';
import { Router } from 'express';

// Use type assertion to inform TS that app has authController
export function registerAuthRoutes(app: Rocket & { authController: AuthController }, router: Router) {
  const controller = app.authController;
  router.post('/auth/register', controller.register.bind(controller));
  router.post('/auth/login', controller.login.bind(controller));
  router.post('/auth/logout', controller.logout.bind(controller));
  router.get('/auth/me', controller.me.bind(controller));
}
