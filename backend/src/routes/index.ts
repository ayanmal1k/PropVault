import { Router } from "express";
import authRoutes from "./auth.routes";
import propertyRoutes from "./property.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";
import agencyRoutes from "./agency.routes";
import projectRoutes from "./project.routes";
import blogRoutes from "./blog.routes";
import leadRoutes from "./lead.routes";
import favoriteRoutes from "./favorite.routes";
import uploadRoutes from "./upload.routes";
import stripeRoutes from "./stripe.routes";
import analyticsRoutes from "./analytics.routes";
import areaGuideRoutes from "./areaGuide.routes";
import calculatorRoutes from "./calculator.routes";
import chatRoutes from "./chat.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/agencies", agencyRoutes);
router.use("/projects", projectRoutes);
router.use("/blog", blogRoutes);
router.use("/leads", leadRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/upload", uploadRoutes);
router.use("/stripe", stripeRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/area-guides", areaGuideRoutes);
router.use("/calculators", calculatorRoutes);
router.use("/chat", chatRoutes);

export default router;
