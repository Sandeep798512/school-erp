import { Request, Response } from 'express';
import { LibraryService } from './library.service.js';
import {
  CreateBookSchema,
  IssueBookSchema,
  ReturnBookSchema
} from '@school-erp/shared';

export class LibraryController {
  static createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = CreateBookSchema.parse(req.body);
      const book = await LibraryService.createBook(parsed);

      res.status(201).json({
        success: true,
        message: 'Book added to catalog successfully',
        data: book
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to add book to catalog'
      });
    }
  };

  static getBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const search = req.query.search as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const books = await LibraryService.getBooks(schoolId, search);
      res.json({
        success: true,
        data: books
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch library catalog'
      });
    }
  };

  static issueBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = IssueBookSchema.parse(req.body);
      const loan = await LibraryService.issueBook(parsed);

      res.status(201).json({
        success: true,
        message: 'Book issued successfully',
        data: loan
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to issue book'
      });
    }
  };

  static returnBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const loanId = req.params.id;
      const fineAmount = req.body.fineAmount !== undefined ? Number(req.body.fineAmount) : undefined;

      const parsed = ReturnBookSchema.parse({ loanId, fineAmount });
      const loan = await LibraryService.returnBook(parsed);

      res.json({
        success: true,
        message: 'Book returned successfully',
        data: loan
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to return book'
      });
    }
  };

  static getLoans = async (req: Request, res: Response): Promise<void> => {
    try {
      const schoolId = (req.query.schoolId as string) || (req.headers['x-school-id'] as string) || req.user?.schoolId;
      const borrowerUserId = req.query.borrowerUserId as string | undefined;
      const status = req.query.status as string | undefined;

      if (!schoolId) {
        res.status(400).json({ success: false, error: 'School ID is required' });
        return;
      }

      const loans = await LibraryService.getLoans(schoolId, borrowerUserId, status);
      res.json({
        success: true,
        data: loans
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch book loans'
      });
    }
  };
}
