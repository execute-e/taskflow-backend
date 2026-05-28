import 'express-session';
import { User } from '@taskflow/database';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
