import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt, scryptSync } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  private userService: UsersService;
  private version = '1';
  private algorithm = 'sha512';
  private keylen = 64;
  private n = 16384;
  private r = 8;
  private p = 1;
  private delimiter = '$';

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

    const hash = scryptSync(password, salt, this.keylen, {
      N: this.n,
      r: this.r,
      p: this.p,
    }).toString('hex');
    const passwordHash = this.getPasswordHash(salt, hash);

    // Create a new user and save it
    return await this.userService.create(email, passwordHash);
  }

  async signIn(email: string, password: string) {
    // See if email is in use
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Email is not registered');
    }

    const parsedPassword = this.parsePasswordHash(user.password);

    const hash = scryptSync(password, parsedPassword.salt, this.keylen, {
      N: this.n,
      r: this.r,
      p: this.p,
    }).toString('hex');

    const passwordHash = this.getPasswordHash(parsedPassword.salt, hash);

    if (user.password !== passwordHash) {
      throw new Error('Incorrect password');
    }

    return user;
  }

  private getPasswordHash(salt: string, hash: string) {
    return [
      this.version,
      this.algorithm,
      this.keylen,
      this.n,
      this.r,
      this.p,
      salt,
      hash,
    ].join(this.delimiter);
  }

  private parsePasswordHash(passwordHash: string): ParsedPasswordHash {
    const [version, algorithm, keylen, n, r, p, salt, hash] = passwordHash.split(this.delimiter);

    return {
      version: Number(version),
      algorithm,
      keylen: Number(keylen),
      n: Number(n),
      r: Number(r),
      p: Number(p),
      salt,
      hash,
    };
  }
}

interface ParsedPasswordHash {
  version: number;
  algorithm: string;
  keylen: number;
  n: number;
  r: number;
  p: number;
  salt: string;
  hash: string;
}