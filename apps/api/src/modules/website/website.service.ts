import { prisma } from '../../common/prisma/prisma.service.js';

export class WebsiteService {
  public static async getSchoolPublicInfo() {
    const school = await prisma.school.findFirst({
      include: {
        campuses: true,
        _count: {
          select: { students: true, teachers: true }
        }
      }
    });

    return {
      schoolName: school?.name || "St. Xavier's High School North",
      code: school?.code || 'SCH-NORTH-01',
      logoUrl: school?.logoUrl,
      address: school?.address || 'North Campus, Sector 4, Knowledge City',
      phone: school?.phone || '+1-800-555-0199',
      email: school?.email || 'contact@stxaviersnorth.edu',
      website: school?.website || 'https://stxaviersnorth.edu',
      stats: {
        totalStudents: '60,000+',
        passRate: '99.4%',
        qualifiedTeachers: '2,500+',
        campusesCount: school?.campuses.length || 5
      },
      vision: 'To empower future leaders through holistic education, state-of-the-art technological infrastructure, and unyielding academic rigor.',
      principalName: 'Dr. Arthur Pendelton, Ph.D.',
      principalMessage: 'Welcome to St. Xavier’s High School. We believe education is not merely the learning of facts, but the training of the mind to think critically and solve real-world problems.'
    };
  }

  public static async getPublicNotices() {
    return prisma.notice.findMany({
      where: { targetAudience: 'ALL' },
      take: 5,
      orderBy: { publishedAt: 'desc' }
    });
  }

  public static async getPublicEvents() {
    return [
      {
        id: 'evt-01',
        title: 'Annual Science & Robotics Expo 2026',
        date: '2026-10-15',
        location: 'Main Auditorium, North Campus',
        description: 'Showcasing AI prototypes, automated robotics projects, and young innovator research papers.'
      },
      {
        id: 'evt-02',
        title: 'Inter-School Athletics & Sports Meet',
        date: '2026-11-02',
        location: 'Olympic Sports Ground',
        description: 'Annual track and field championships involving 30 participating regional schools.'
      },
      {
        id: 'evt-03',
        title: 'Parent-Teacher Academic Symposium',
        date: '2026-11-20',
        location: 'Conference Center',
        description: 'Interactive session reviewing term academic progress and career counseling workshops.'
      }
    ];
  }
}
