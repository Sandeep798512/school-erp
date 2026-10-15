import { Router } from 'express';
import { OrganizationController } from './organization.controller.js';
import { authenticateJwt, requirePermissions, requireRoles } from '../../common/middleware/auth.middleware.js';
import { ensureTenantAccess } from '../../common/middleware/tenant-guard.middleware.js';
import { UserRole, SystemPermissions } from '@school-erp/shared';

export const organizationRouter = Router();

// Apply global JWT Authentication guard
organizationRouter.use(authenticateJwt);

// Organizations (Super Admin Only)
organizationRouter.get('/organizations', requireRoles(UserRole.SUPER_ADMIN), OrganizationController.getOrganizations);
organizationRouter.get('/organizations/:id', requireRoles(UserRole.SUPER_ADMIN), OrganizationController.getOrganizationById);
organizationRouter.post('/organizations', requireRoles(UserRole.SUPER_ADMIN), OrganizationController.createOrganization);

// Schools
organizationRouter.get('/schools', OrganizationController.getSchools);
organizationRouter.get('/schools/:id', ensureTenantAccess('id'), OrganizationController.getSchoolById);
organizationRouter.post('/schools', requireRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), OrganizationController.createSchool);

// Campuses
organizationRouter.get('/campuses', OrganizationController.getCampuses);
organizationRouter.post('/campuses', requirePermissions(SystemPermissions.SCHOOL_CONFIGURE), OrganizationController.createCampus);

// Academic Years
organizationRouter.get('/academic-years', OrganizationController.getAcademicYears);
organizationRouter.post('/academic-years', requirePermissions(SystemPermissions.SCHOOL_CONFIGURE), OrganizationController.createAcademicYear);

// System Settings
organizationRouter.get('/settings', OrganizationController.getSettings);
organizationRouter.put('/settings', requirePermissions(SystemPermissions.SETTINGS_MANAGE), OrganizationController.updateSetting);
