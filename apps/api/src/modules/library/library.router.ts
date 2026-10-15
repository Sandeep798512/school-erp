import { Router } from 'express';
import { LibraryController } from './library.controller.js';
import { authenticateJwt } from '../../common/middleware/auth.middleware.js';

export const libraryRouter = Router();

// Apply JWT Authentication Guard
libraryRouter.use(authenticateJwt);

// Catalog Management
libraryRouter.get('/books', LibraryController.getBooks);
libraryRouter.post('/books', LibraryController.createBook);

// Book Loans & Returns
libraryRouter.get('/loans', LibraryController.getLoans);
libraryRouter.post('/loans/issue', LibraryController.issueBook);
libraryRouter.post('/loans/:id/return', LibraryController.returnBook);
