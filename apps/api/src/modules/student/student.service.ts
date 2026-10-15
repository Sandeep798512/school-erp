import { prisma } from '../../common/prisma/prisma.service.js';
import { PasswordUtil } from '../../common/utils/password.util.js';
import {
  CreateStudentDto,
  UpdateStudentDto,
  EnrollStudentDto,
  TransferStudentDto,
  UserRole
} from '@school-erp/shared';

export class StudentService {
  // Transactional Admission Registration Workflow
  public static async createStudent(dto: CreateStudentDto) {
    const defaultPasswordHash = await PasswordUtil.hashPassword('School@12345');

    return prisma.$transaction(async (tx) => {
      // 1. Find or create STUDENT role
      const studentRole = await tx.role.findFirst({
        where: { name: UserRole.STUDENT }
      });

      // 2. Create User account for Student
      const user = await tx.user.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          email: dto.email,
          passwordHash: defaultPasswordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.emergencyContact,
          mustChangePassword: true,
          status: 'ACTIVE'
        }
      });

      if (studentRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: studentRole.id
          }
        });
      }

      // 3. Create Student profile
      const student = await tx.student.create({
        data: {
          organizationId: dto.organizationId,
          schoolId: dto.schoolId,
          userId: user.id,
          admissionNumber: dto.admissionNumber,
          rollNumber: dto.rollNumber,
          dob: new Date(dto.dob),
          gender: dto.gender,
          bloodGroup: dto.bloodGroup,
          category: dto.category,
          address: dto.address,
          emergencyContact: dto.emergencyContact,
          status: 'ACTIVE'
        }
      });

      // 4. Create Guardian if provided
      if (dto.primaryGuardian) {
        const guardian = await tx.guardian.create({
          data: {
            organizationId: dto.organizationId,
            schoolId: dto.schoolId,
            firstName: dto.primaryGuardian.firstName,
            lastName: dto.primaryGuardian.lastName,
            relation: dto.primaryGuardian.relation,
            phone: dto.primaryGuardian.phone,
            email: dto.primaryGuardian.email,
            occupation: dto.primaryGuardian.occupation
          }
        });

        await tx.studentGuardian.create({
          data: {
            studentId: student.id,
            guardianId: guardian.id,
            isPrimary: true
          }
        });
      }

      return student;
    });
  }

  // Paginated Search & Directory
  public static async getStudents(params: {
    schoolId: string;
    classId?: string;
    sectionId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const whereClause: any = {
      schoolId: params.schoolId,
      status: 'ACTIVE'
    };

    if (params.search) {
      whereClause.OR = [
        { admissionNumber: { contains: params.search, mode: 'insensitive' } },
        { user: { firstName: { contains: params.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: params.search, mode: 'insensitive' } } }
      ];
    }

    if (params.classId || params.sectionId) {
      whereClause.enrollments = {
        some: {
          ...(params.classId ? { classId: params.classId } : {}),
          ...(params.sectionId ? { sectionId: params.sectionId } : {})
        }
      };
    }

    const [totalItems, students] = await Promise.all([
      prisma.student.count({ where: whereClause }),
      prisma.student.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, phone: true }
          },
          enrollments: {
            include: {
              class: { select: { name: true, code: true } },
              section: { select: { name: true } }
            },
            take: 1,
            orderBy: { createdAt: 'desc' }
          },
          studentGuardians: {
            include: {
              guardian: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      students,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  public static async getStudentById(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true }
        },
        studentGuardians: {
          include: { guardian: true }
        },
        enrollments: {
          include: {
            academicYear: true,
            class: true,
            section: true
          }
        },
        attendanceRecords: {
          take: 30,
          orderBy: { date: 'desc' }
        }
      }
    });
  }

  public static async updateStudent(id: string, dto: UpdateStudentDto) {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) throw new Error('STUDENT_NOT_FOUND');

    if (dto.firstName || dto.lastName || dto.email) {
      await prisma.user.update({
        where: { id: student.userId },
        data: {
          ...(dto.firstName ? { firstName: dto.firstName } : {}),
          ...(dto.lastName ? { lastName: dto.lastName } : {}),
          ...(dto.email ? { email: dto.email } : {})
        }
      });
    }

    return prisma.student.update({
      where: { id },
      data: {
        ...(dto.gender ? { gender: dto.gender } : {}),
        ...(dto.bloodGroup ? { bloodGroup: dto.bloodGroup } : {}),
        ...(dto.category ? { category: dto.category } : {}),
        ...(dto.address ? { address: dto.address } : {}),
        ...(dto.emergencyContact ? { emergencyContact: dto.emergencyContact } : {})
      }
    });
  }

  public static async enrollStudent(studentId: string, dto: EnrollStudentDto) {
    return prisma.studentEnrollment.upsert({
      where: {
        academicYearId_studentId: {
          academicYearId: dto.academicYearId,
          studentId
        }
      },
      update: {
        classId: dto.classId,
        sectionId: dto.sectionId,
        rollNumber: dto.rollNumber
      },
      create: {
        organizationId: dto.organizationId,
        schoolId: dto.schoolId,
        academicYearId: dto.academicYearId,
        studentId,
        classId: dto.classId,
        sectionId: dto.sectionId,
        rollNumber: dto.rollNumber
      }
    });
  }

  public static async transferStudent(studentId: string, dto: TransferStudentDto) {
    return prisma.student.update({
      where: { id: studentId },
      data: {
        status: dto.targetStatus
      }
    });
  }
}
