import express from "express";

import { signup } from "../controller/authController";

const router = express.Router();

router.post("/signup", signup);
router.get("/", (req, res) => {
	res.status(200).json({ success: true });
});

export default router;
