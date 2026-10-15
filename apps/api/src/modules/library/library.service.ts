import { prisma } from '../../common/prisma/prisma.service.js';
import { Prisma, LoanStatus } from '@prisma/client';
import {
  CreateBookDto,
  IssueBookDto,
  ReturnBookDto
} from '@school-erp/shared';

export class LibraryService {
  // 1. Add Book to Catalog
  static async createBook(dto: CreateBookDto) {
    return prisma.libraryBook.create({
      data: {
        schoolId: dto.schoolId,
        title: dto.title,
        author: dto.author,
        isbn: dto.isbn ?? null,
        publisher: dto.publisher ?? null,
        copiesTotal: dto.copiesTotal,
        copiesAvailable: dto.copiesTotal
      }
    });
  }

  // 2. Search & List Books
  static async getBooks(schoolId: string, search?: string) {
    const where: any = { schoolId };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } }
      ];
    }

    return prisma.libraryBook.findMany({
      where,
      orderBy: { title: 'asc' }
    });
  }

  // 3. Issue Book Loan
  static async issueBook(dto: IssueBookDto) {
    const book = await prisma.libraryBook.findUnique({
      where: { id: dto.bookId }
    });

    if (!book) {
      throw new Error(`Book not found in library catalog.`);
    }

    if (book.copiesAvailable <= 0) {
      throw new Error(`No available copies of '${book.title}' to issue.`);
    }

    const borrower = await prisma.user.findUnique({
      where: { id: dto.borrowerUserId }
    });

    if (!borrower) {
      throw new Error(`Borrower user profile not found.`);
    }

    return prisma.$transaction(async (tx) => {
      // Decrement available copies
      await tx.libraryBook.update({
        where: { id: dto.bookId },
        data: { copiesAvailable: { decrement: 1 } }
      });

      // Create loan record
      return tx.bookLoan.create({
        data: {
          schoolId: dto.schoolId,
          bookId: dto.bookId,
          borrowerUserId: dto.borrowerUserId,
          issueDate: new Date(),
          dueDate: new Date(dto.dueDate),
          status: 'ISSUED'
        },
        include: {
          book: true,
          borrower: {
            select: { id: true, email: true, firstName: true, lastName: true }
          }
        }
      });
    });
  }

  // 4. Return Book Loan & Fine Calculation
  static async returnBook(dto: ReturnBookDto) {
    const loan = await prisma.bookLoan.findUnique({
      where: { id: dto.loanId },
      include: { book: true }
    });

    if (!loan) {
      throw new Error(`Book loan record not found.`);
    }

    if (loan.status === 'RETURNED') {
      throw new Error(`Book has already been returned.`);
    }

    const now = new Date();
    let calculatedFine = 0;
    if (now > loan.dueDate) {
      const diffTime = Math.abs(now.getTime() - loan.dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      calculatedFine = diffDays * 2.0; // standard $2/day overdue fine
    }

    const finalFine = dto.fineAmount !== undefined ? dto.fineAmount : calculatedFine;

    return prisma.$transaction(async (tx) => {
      // Increment available copies
      await tx.libraryBook.update({
        where: { id: loan.bookId },
        data: { copiesAvailable: { increment: 1 } }
      });

      // Update loan status
      return tx.bookLoan.update({
        where: { id: dto.loanId },
        data: {
          status: 'RETURNED',
          returnDate: now,
          fineAmount: new Prisma.Decimal(finalFine)
        },
        include: {
          book: true,
          borrower: {
            select: { id: true, email: true, firstName: true, lastName: true }
          }
        }
      });
    });
  }

  // 5. Query Loans
  static async getLoans(schoolId: string, borrowerUserId?: string, status?: string) {
    const where: any = { schoolId };
    if (borrowerUserId) where.borrowerUserId = borrowerUserId;
    if (status) where.status = status as LoanStatus;

    return prisma.bookLoan.findMany({
      where,
      include: {
        book: true,
        borrower: {
          select: { id: true, email: true, firstName: true, lastName: true }
        }
      },
      orderBy: { issueDate: 'desc' }
    });
  }
}
