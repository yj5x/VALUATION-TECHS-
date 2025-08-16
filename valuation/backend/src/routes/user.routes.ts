import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getUserProfile, updateProfile } from "../controllers/user.controller";
import { validate } from "../middleware/validation.middleware";
import { updateProfileSchema } from "../utils/validationSchemas";

const router = Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);

export default router;

