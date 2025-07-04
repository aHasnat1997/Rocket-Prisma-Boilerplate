import { Rocket } from '../../app';
import { Request, Response } from 'express';
import { UserService } from './UserService';

export class UserController {
  private app: Rocket;
  private service: UserService;

  constructor(app: Rocket) {
    this.app = app;
    this.service = new UserService(app);
  }

  async create(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
      }
      const data = await this.service.create({ email, password, name });
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(409).json({ success: false, message: 'Email already exists' });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.app.db.client.user.findMany();
    res.json(users);
  }

  async findAll(req: Request, res: Response) {
    // Use the advanced query builder for full features
    const builder = this.service.findAll(req.query);
    const { data, meta } = await builder.exec();
    res.json({ success: true, data, meta });
  }

  async findOne(req: Request, res: Response) {
    const data = await this.service.findOne(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data });
  }

  async update(req: Request, res: Response) {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);
      res.json({ success: true, data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(409).json({ success: false, message: 'Email already exists' });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
