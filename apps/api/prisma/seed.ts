import { PrismaClient, UserStatus } from '@prisma/client';
import { UserRole, SystemPermissions } from '@school-erp/shared';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise School ERP Database Seeding...');

  // 1. Seed System Permissions
  const permissionKeys = Object.values(SystemPermissions);
  console.log(`Creating ${permissionKeys.length} fine-grained permissions...`);

  for (const permKey of permissionKeys) {
    const [moduleName] = permKey.split('.');
    await prisma.permission.upsert({
      where: { key: permKey },
      update: {},
      create: {
        key: permKey,
        module: moduleName.toUpperCase(),
        description: `Permission node for ${permKey}`
      }
    });
  }

  // 2. Create Sample Organization & School
  console.log('Creating sample Organization and School...');
  const org = await prisma.organization.upsert({
    where: { code: 'ORG-XAVIER-01' },
    update: {},
    create: {
      name: "St. Xavier's Educational Trust",
      code: 'ORG-XAVIER-01',
      address: '100 Education Boulevard, Knowledge City'
    }
  });

  const school = await prisma.school.upsert({
    where: { code: 'SCH-NORTH-01' },
    update: {},
    create: {
      organizationId: org.id,
      name: "St. Xavier's High School North",
      code: 'SCH-NORTH-01',
      email: 'contact@stxaviersnorth.edu',
      phone: '+1-800-555-0199',
      address: 'North Campus, Sector 4'
    }
  });

  const campus = await prisma.campus.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      schoolId: school.id,
      name: 'North Main Campus',
      code: 'CAMPUS-01',
      isMain: true
    }
  });

  const academicYear = await prisma.academicYear.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      schoolId: school.id,
      name: '2026-2027',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      isCurrent: true
    }
  });

  // 3. Seed Roles for School
  const systemRoles = Object.values(UserRole);
  console.log(`Creating ${systemRoles.length} system roles for school...`);
  const roleMap: Record<string, string> = {};

  for (const roleName of systemRoles) {
    const role = await prisma.role.upsert({
      where: { schoolId_name: { schoolId: school.id, name: roleName } },
      update: {},
      create: {
        schoolId: school.id,
        organizationId: org.id,
        name: roleName,
        isSystem: true,
        description: `System defined default role ${roleName}`
      }
    });
    roleMap[roleName] = role.id;
  }

  // 4. Assign All Permissions to SUPER_ADMIN & SCHOOL_ADMIN
  const allPermissions = await prisma.permission.findMany();
  const adminRoleIds = [roleMap[UserRole.SUPER_ADMIN], roleMap[UserRole.SCHOOL_ADMIN]].filter(Boolean);

  for (const roleId of adminRoleIds) {
    for (const perm of allPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId: perm.id } },
        update: {},
        create: { roleId, permissionId: perm.id }
      }).catch(() => {});
    }
  }

  // 5. Seed School Settings
  await prisma.systemSetting.createMany({
    data: [
      { schoolId: school.id, key: 'CURRENCY_SYMBOL', value: '$', description: 'School currency symbol' },
      { schoolId: school.id, key: 'ATTENDANCE_MODE', value: 'DAILY', description: 'Default attendance tracking mode' },
      { schoolId: school.id, key: 'GRADING_SYSTEM', value: 'CBSE_STANDARD', description: 'Active grading evaluation scale' }
    ],
    skipDuplicates: true
  });

  // 6. Seed Default Users with Passwords
  console.log('Seeding default test accounts...');
  const defaultPasswordHash = await bcrypt.hash('Admin@123', 10);
  const teacherPasswordHash = await bcrypt.hash('Teacher@123', 10);
  const studentPasswordHash = await bcrypt.hash('Student@123', 10);
  const parentPasswordHash = await bcrypt.hash('Parent@123', 10);
  const accountantPasswordHash = await bcrypt.hash('Accountant@123', 10);

  // A. Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@stxaviers.com' },
    update: { passwordHash: defaultPasswordHash },
    create: {
      organizationId: org.id,
      schoolId: school.id,
      email: 'admin@stxaviers.com',
      passwordHash: defaultPasswordHash,
      firstName: 'System',
      lastName: 'Administrator',
      status: UserStatus.ACTIVE
    }
  });
  if (roleMap[UserRole.SUPER_ADMIN]) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: roleMap[UserRole.SUPER_ADMIN] } },
      update: {},
      create: { userId: adminUser.id, roleId: roleMap[UserRole.SUPER_ADMIN] }
    });
  }

  // B. Teacher
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@stxaviers.com' },
    update: { passwordHash: teacherPasswordHash },
    create: {
      organizationId: org.id,
      schoolId: school.id,
      email: 'teacher@stxaviers.com',
      passwordHash: teacherPasswordHash,
      firstName: 'Rahul',
      lastName: 'Sharma',
      status: UserStatus.ACTIVE
    }
  });
  if (roleMap[UserRole.TEACHER]) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: teacherUser.id, roleId: roleMap[UserRole.TEACHER] } },
      update: {},
      create: { userId: teacherUser.id, roleId: roleMap[UserRole.TEACHER] }
    });
  }
  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      organizationId: org.id,
      schoolId: school.id,
      userId: teacherUser.id,
      employeeCode: 'TCH-2026-001',
      qualification: 'M.Sc. Mathematics, B.Ed',
      specialization: 'Mathematics & Science',
      joiningDate: new Date('2024-06-01')
    }
  }).catch(() => {});

  // C. Student
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@stxaviers.com' },
    update: { passwordHash: studentPasswordHash },
    create: {
      organizationId: org.id,
      schoolId: school.id,
      email: 'student@stxaviers.com',
      passwordHash: studentPasswordHash,
      firstName: 'Aarav',
      lastName: 'Patel',
      status: UserStatus.ACTIVE
    }
  });
  if (roleMap[UserRole.STUDENT]) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: studentUser.id, roleId: roleMap[UserRole.STUDENT] } },
      update: {},
      create: { userId: studentUser.id, roleId: roleMap[UserRole.STUDENT] }
    });
  }
  const studentProfile = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      organizationId: org.id,
      schoolId: school.id,
      userId: studentUser.id,
      admissionNumber: 'ADM-2026-001',
      rollNumber: '101',
      dob: new Date('2010-05-15'),
      gender: 'Male',
      bloodGroup: 'B+'
    }
  }).catch(() => null);

  // D. Parent
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@stxaviers.com' },
    update: { passwordHash: parentPasswordHash },
    create: {
      organizationId: org.id,
      schoolId: school.id,
      email: 'parent@stxaviers.com',
      passwordHash: parentPasswordHash,
      firstName: 'Vikram',
      lastName: 'Patel',
      status: UserStatus.ACTIVE
    }
  });
  if (roleMap[UserRole.PARENT]) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: parentUser.id, roleId: roleMap[UserRole.PARENT] } },
      update: {},
      create: { userId: parentUser.id, roleId: roleMap[UserRole.PARENT] }
    });
  }
  const guardianProfile = await prisma.guardian.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      organizationId: org.id,
      schoolId: school.id,
      userId: parentUser.id,
      relationship: 'Father',
      occupation: 'Senior Engineer',
      phone: '+1-555-0144'
    }
  }).catch(() => null);

  if (studentProfile && guardianProfile) {
    await prisma.studentGuardian.upsert({
      where: { studentId_guardianId: { studentId: studentProfile.id, guardianId: guardianProfile.id } },
      update: {},
      create: {
        studentId: studentProfile.id,
        guardianId: guardianProfile.id,
        isPrimary: true
      }
    }).catch(() => {});
  }

  // E. Accountant
  const accountantUser = await prisma.user.upsert({
    where: { email: 'accountant@stxaviers.com' },
    update: { passwordHash: accountantPasswordHash },
    create: {
      organizationId: org.id,
      schoolId: school.id,
      email: 'accountant@stxaviers.com',
      passwordHash: accountantPasswordHash,
      firstName: 'Priya',
      lastName: 'Verma',
      status: UserStatus.ACTIVE
    }
  });
  if (roleMap[UserRole.ACCOUNTANT]) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: accountantUser.id, roleId: roleMap[UserRole.ACCOUNTANT] } },
      update: {},
      create: { userId: accountantUser.id, roleId: roleMap[UserRole.ACCOUNTANT] }
    });
  }

  console.log(`\n🎉 Seeding Complete! Default Login Credentials:`);
  console.log(`----------------------------------------------------------------`);
  console.log(`1. Super Admin: admin@stxaviers.com      | Password: Admin@123`);
  console.log(`2. Teacher:     teacher@stxaviers.com    | Password: Teacher@123`);
  console.log(`3. Student:     student@stxaviers.com    | Password: Student@123`);
  console.log(`4. Parent:      parent@stxaviers.com     | Password: Parent@123`);
  console.log(`5. Accountant:  accountant@stxaviers.com | Password: Accountant@123`);
  console.log(`----------------------------------------------------------------`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
