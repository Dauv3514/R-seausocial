import express from 'express';
import { getUser, updateUser, getUsersNotFollowedByUser, getUsersFollowedByUser } from '../controllers/user.js';
const router = express.Router();

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.get("/:userId/not-followed", getUsersNotFollowedByUser);
router.get("/:userId/followed", getUsersFollowedByUser);

export default router;