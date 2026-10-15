export const SystemPermissions = {
  // Organization & School Config
  ORGANIZATION_MANAGE: 'organization.manage',
  SCHOOL_CONFIGURE: 'school.configure',
  SETTINGS_MANAGE: 'settings.manage',

  // Student Lifecycle
  STUDENTS_VIEW: 'students.view',
  STUDENTS_CREATE: 'students.create',
  STUDENTS_UPDATE: 'students.update',
  STUDENTS_DELETE: 'students.delete',
  STUDENTS_PROFILE_OWN: 'students.profile.own',

  // Attendance
  ATTENDANCE_VIEW: 'attendance.view',
  ATTENDANCE_MARK: 'attendance.mark',
  ATTENDANCE_MODIFY: 'attendance.modify',

  // Fees & Finance
  FEES_VIEW: 'fees.view',
  FEES_CONFIGURE: 'fees.configure',
  FEES_COLLECT: 'fees.collect',
  FEES_REFUND: 'fees.refund',
  FEES_VIEW_OWN: 'fees.view.own',

  // Examinations & Results
  EXAMS_CREATE: 'exams.create',
  EXAMS_MANAGE: 'exams.manage',
  RESULTS_ENTER: 'results.enter',
  RESULTS_PUBLISH: 'results.publish',

  // Library & Operations
  LIBRARY_MANAGE: 'library.manage',
  TRANSPORT_MANAGE: 'transport.manage',
  AUDIT_VIEW: 'audit.view'
} as const;

export type SystemPermissionKey = typeof SystemPermissions[keyof typeof SystemPermissions];
