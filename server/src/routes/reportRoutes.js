import express from 'express';
import { getPendingReports, updateReportStatus } from '../controllers/reportController.js';

const router = express.Router();

router.get('/admin/pending', getPendingReports);
router.put('/admin/:id/status', updateReportStatus);

export default router;