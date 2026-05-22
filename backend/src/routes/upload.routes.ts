import { Router } from "express";
import multer from "multer";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "@prisma/client";
import { sendSuccess, sendError } from "../utils/apiResponse";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Invalid file type. Only JPEG, PNG, WebP allowed."));
      return;
    }
    cb(null, true);
  },
});

router.post(
  "/image",
  authenticate(),
  authorize(UserRole.USER, UserRole.AGENT, UserRole.AGENCY_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  async (req, res) => {
    if (!req.file) return sendError(res, "No file uploaded");
    const url = `https://picsum.photos/seed/${Date.now()}/800/600`;
    sendSuccess(res, { url, publicId: `dev-${Date.now()}` });
  }
);

export default router;
