import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const privateKey = (process.env.JWT_PRIVATE_KEY as string).replace(/\\n/g, '\n');
const publicKey = (process.env.JWT_PUBLIC_KEY as string).replace(/\\n/g, '\n');

export interface TokenPayload {
  id?: string;
  role: 'user' | 'shop' | 'admin' | 'customer';
  sessionId?: string; // Only for customer sessions
  shopId?: string; // Only for customer sessions
}

export const signToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '7d' as SignOptions['expiresIn']
  };
  return jwt.sign(payload, privateKey, options);
};


export const verifyToken = (token: string): TokenPayload & JwtPayload => {
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as TokenPayload & JwtPayload;
};
