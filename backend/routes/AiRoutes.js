import { Router } from 'express';
import { verifyJWT } from '../middleware/AuthMiddleware.js';
import { upload } from '../middleware/MulterMiddleware.js';
import { parseStatement, saveTransactions, getInsights } from '../controllers/AiController.js';

const aiRouter = Router();

// All routes are protected — user must be logged in
aiRouter.post('/parse-statement',    verifyJWT, upload.single('statement'), parseStatement);
aiRouter.post('/save-transactions',  verifyJWT, saveTransactions);
aiRouter.post('/insights',           verifyJWT, getInsights);

export { aiRouter };
