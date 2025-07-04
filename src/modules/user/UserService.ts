import { Rocket } from '../../app';
import bcrypt from 'bcryptjs';

export class UserService {
  private app: Rocket;
  constructor(app: Rocket) {
    this.app = app;
  }

  async create(data: { email: string; password: string; name: string }) {
    const { password, email, name } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: { email: string; password: string; name: string } = {
      name,
      email,
      password: hashedPassword,
    };
    // Only include 'name' if it is defined
    if (typeof name === 'string') {
      (userData as any).name = name;
    }
    return this.app.db.client.user.create({
      data: userData,
      select: { id: true, email: true, name: true }
    });
  }

  findAll(query: any) {
    const fields = ["id", "email", "name", "createdAt"];
    return this.app.db.findAll('user', query, {
      searchableFields: ['email', 'name'],
      select: fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}),
    });
  }

  findOne(id: number) {
    return this.app.db.client.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true }
    });
  }

  async update(id: number, data: { email?: string; password?: string; name?: string }) {
    const { password, ...rest } = data;
    const updateData: any = { ...rest };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    return this.app.db.client.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true }
    });
  }

  delete(id: number) {
    return this.app.db.client.user.delete({ where: { id } });
  }
}
