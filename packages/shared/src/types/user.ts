import { UserRole } from '../constants/roles.js';

export interface UserAuthContext {
  userId: string;
  email: string;
  organizationId: string;
  schoolId: string;
  campusId?: string;
  roles: UserRole[];
  permissions: string[];
}
