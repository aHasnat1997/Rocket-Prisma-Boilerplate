import { Rocket } from '../../app';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response, Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  private app: Rocket;
  constructor(app: Rocket) {
    this.app = app;
  }

  async register(data: { email: string; password: string; name: string }) {
    const { email, password, name } = data;
    const existing = await this.app.db.client.user.findUnique({ where: { email } });
    if (existing) {
      return { status: 409, data: { success: false, message: 'Email already exists' } };
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.app.db.client.user.create({
      data: { email, password: hashed, name },
      select: { id: true, email: true, name: true }
    });
    return { status: 201, data: { success: true, user } };
  }

  async login(data: { email: string; password: string }, res: Response) {
    const { email, password } = data;
    const user = await this.app.db.client.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return { status: 401, data: { success: false, message: 'Invalid credentials' } };
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return { status: 401, data: { success: false, message: 'Invalid credentials' } };
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return { status: 200, data: { success: true, token } };
  }

  async logout(res: Response) {
    res.clearCookie('token');
  }

  async me(req: Request) {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const user = await this.app.db.client.user.findUnique({ where: { id: decoded.id }, select: { id: true, email: true, name: true } });
      return user;
    } catch {
      return null;
    }
  }
}
