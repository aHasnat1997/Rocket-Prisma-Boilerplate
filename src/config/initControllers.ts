import { Rocket } from '../app';
import { UserController } from '../modules/user/UserController';
import { AuthController } from '../modules/auth/AuthController';
import { registerAuthRoutes } from '../modules/auth/auth.routes';
import { registerUserRoutes } from '../modules/user/user.routes';
import { Router } from 'express';

export function initControllers(app: Rocket, router: Router) {
  try {
    (app as any).userController = new UserController(app);
    (app as any).authController = new AuthController(app);

    registerUserRoutes(app as Rocket & { userController: UserController }, router);
    registerAuthRoutes(app as Rocket & { authController: AuthController }, router);
  } catch (error) {
    console.error('Error in initControllers:', error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    throw error;
  }
}
