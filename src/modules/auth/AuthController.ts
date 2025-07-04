import { Rocket } from '../../app';
import { Request, Response } from 'express';
import { AuthService } from './AuthService';

export class AuthController {
  private app: Rocket;
  private service: AuthService;

  constructor(app: Rocket) {
    this.app = app;
    this.service = new AuthService(app);
  }

  async register(req: Request, res: Response) {
    const result = await this.service.register(req.body);
    res.status(result.status).json(result.data);
  }

  async login(req: Request, res: Response) {
    const result = await this.service.login(req.body, res);
    res.status(result.status).json(result.data);
  }

  async logout(req: Request, res: Response) {
    await this.service.logout(res);
    res.status(200).json({ success: true, message: 'Logged out' });
  }

  async me(req: Request, res: Response) {
    const user = await this.service.me(req);
    if (user) res.json(user);
    else res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}
