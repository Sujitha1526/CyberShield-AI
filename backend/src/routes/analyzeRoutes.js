import { Router } from 'express';
import { analyzeText, saveAnalysis } from '../controllers/analyzeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// /analyze is public so unauthenticated users can still demo the tool
router.post('/analyze', analyzeText);

// /save requires auth so the message is linked to the logged-in user
router.post('/save', protect, saveAnalysis);

export default router;
