import { Request } from 'express';
import { TUser } from 'src/types';

export interface AuthRequest extends Request {
  user?: TUser;
}
