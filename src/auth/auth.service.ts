import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt, scryptSync } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  private userService: UsersService;

  constructor(userService: UsersService) {
    this.userService = userService;
  }

  async signUp(email: string, password: string) {
    // See if email is in use
    const existing = await this.userService.findByEmail(email);
    if (existing) {
      throw new Error('Email in use');
    }

    // Hash the password
    const salt = randomBytes(16).toString('hex');

    // const algorithm = 'sha512';
    // const iterations = 100_000;
    // // const hash = pbkdf2Sync(password, salt, iterations, 64, algorithm).toString('hex');

    const algorithm = 'scrypt';
    const keylen = 64;
    const n = 16384;
    const r = 8;
    const p = 1;

    const hash = scryptSync(password, salt, keylen, {
      N: n,
      r: r,
      p: p,
    }).toString('hex');

    const delimiter = '$';
    const passwordHash = `${algorithm}${delimiter}${keylen}${delimiter}${n}${delimiter}${r}${delimiter}${p}${delimiter}${salt}${delimiter}${hash}`;

    // Create a new user and save it
    return await this.userService.create(email, passwordHash);
  }

  signIn() {

  }
}
