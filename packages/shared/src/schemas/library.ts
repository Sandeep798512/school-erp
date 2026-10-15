import { z } from 'zod';

export const LoanStatusEnum = z.enum(['ISSUED', 'RETURNED', 'OVERDUE', 'LOST']);
export type LoanStatus = z.infer<typeof LoanStatusEnum>;

export const CreateBookSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  title: z.string().min(2, { message: 'Book title is required' }),
  author: z.string().min(2, { message: 'Author name is required' }),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  copiesTotal: z.number().int().min(1, { message: 'Copies total must be at least 1' }).default(1)
});

export type CreateBookDto = z.infer<typeof CreateBookSchema>;

export const IssueBookSchema = z.object({
  schoolId: z.string().uuid({ message: 'Valid School ID is required' }),
  bookId: z.string().uuid({ message: 'Valid Book ID is required' }),
  borrowerUserId: z.string().uuid({ message: 'Valid Borrower User ID is required' }),
  dueDate: z.string().datetime({ message: 'Valid due date ISO string is required' })
});

export type IssueBookDto = z.infer<typeof IssueBookSchema>;

export const ReturnBookSchema = z.object({
  loanId: z.string().uuid({ message: 'Valid Loan ID is required' }),
  fineAmount: z.number().min(0).optional()
});

export type ReturnBookDto = z.infer<typeof ReturnBookSchema>;
