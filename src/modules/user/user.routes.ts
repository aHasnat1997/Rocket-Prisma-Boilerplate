import { UserController } from './UserController';
import { Rocket } from '../../app';
import { Router } from 'express';

export function registerUserRoutes(app: Rocket & { userController: UserController }, router: Router) {
  const controller = app.userController;
  router.post('/users', controller.create.bind(controller));
  router.get('/users', controller.findAll.bind(controller));
  router.get('/users/:id', controller.findOne.bind(controller));
  router.put('/users/:id', controller.update.bind(controller));
  router.delete('/users/:id', controller.delete.bind(controller));
}
