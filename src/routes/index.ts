import { Router } from 'express';
import { initControllers } from '../config/initControllers';
import { Rocket } from '../app';

export class MainRouter {
  public router: Router;

  constructor(app: Rocket) {
    this.router = Router();
    initControllers(app, this.router);
  }
}
