import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
}

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
