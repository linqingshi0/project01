import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export interface AuthPayload {
  userId: string;
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as AuthPayload;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: '未授权' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = verifyToken(token);
    (req as any).userId = payload.userId;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token 无效' });
  }
}
