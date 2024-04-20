import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { compare } from 'bcrypt';
import { jwtConstants } from './constants/constants';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(user: UserDocument): Promise<string> {
    const { email, name, _id, roles } = user;

    const payload = { _id, email, name, roles };
    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }

  private async generateRefreshToken(user: UserDocument): Promise<string> {
    const { email, name, _id, roles } = user;

    const payload = { _id, email, name, roles };
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: jwtConstants.secret,
    });
  }

  async refreshTokens(refreshToken: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });

      const user = await this.userService.findByEmail(decoded.email);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
