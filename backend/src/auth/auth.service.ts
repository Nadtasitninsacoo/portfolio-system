import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly username = process.env.ADMIN_USERNAME ?? 'admin';
  // เก็บเป็น hash เสมอ (hash จากรหัสผ่านใน env ตอนเริ่มระบบ)
  private readonly passwordHash = bcrypt.hashSync(
    process.env.ADMIN_PASSWORD ?? 'admin1234',
    10,
  );

  constructor(private readonly jwt: JwtService) {}

  login(username: string, password: string): { token: string } {
    const okUser = username === this.username;
    const okPass = bcrypt.compareSync(password ?? '', this.passwordHash);
    if (!okUser || !okPass) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    return { token: this.jwt.sign({ sub: username, role: 'admin' }) };
  }
}
