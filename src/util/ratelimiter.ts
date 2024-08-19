import { rateLimit } from "express-rate-limit";
import { Request } from "express";
import { verifyToken } from "../middleware/access-control.middleware";

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100,
	standardHeaders: "draft-7",
	keyGenerator: (req: Request) => {
		verifyToken(req);
		return req.user.id;
	},
	legacyHeaders: false,
});
