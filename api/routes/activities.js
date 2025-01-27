import express from 'express';
import { getActivities } from '../controllers/activitie.js';
const router = express.Router();

router.get("/:id", getActivities);
export default router;