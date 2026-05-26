import { UserRole } from '@taskflow/database';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    user?: {
      role: UserRole;
    };
  }
}
