import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt, scryptSync } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  private userService: UsersService;
  private static version = '1';
  private static algorithm = 'sha512';
  private static keylen = 64;
  private static n = 16384;
  private static r = 8;
  private static p = 1;
  private static delimiter = '$';

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
    const passwordHash = AuthService.getPasswordHash(password);

    // Create a new user and save it
    return await this.userService.create(email, passwordHash);
  }

  public static getPasswordHash(password: string) {
    const salt = randomBytes(16).toString('hex');

    const hash = this.scriptPassword(password, salt);

    return this.getPasswordHashWithMetadata(salt, hash);
  }

  private static scriptPassword(password: string, salt: string) {
    return scryptSync(password, salt, this.keylen, {
      N: this.n,
      r: this.r,
      p: this.p
    }).toString('hex');
  }

  async signIn(email: string, password: string) {
    // See if email is in use
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Email is not registered');
    }

    const parsedPassword = AuthService.parsePasswordHash(user.password);

    const hash = AuthService.scriptPassword(password, parsedPassword.salt);

    const passwordHash = AuthService.getPasswordHashWithMetadata(parsedPassword.salt, hash);

    if (user.password !== passwordHash) {
      throw new Error('Incorrect password');
    }

    return user;
  }

  private static getPasswordHashWithMetadata(salt: string, hash: string) {
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

  private static parsePasswordHash(passwordHash: string): ParsedPasswordHash {
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