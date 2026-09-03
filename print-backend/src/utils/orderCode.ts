import crypto from 'crypto';

export const generateOrderCode = (): string => {
  const code: string = crypto.randomBytes(4).toString('hex').toUpperCase();
  return code;
};