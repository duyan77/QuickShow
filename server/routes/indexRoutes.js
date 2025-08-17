import showRouter from "./showRoutes.js";
import bookingRouter from "./bookingRoutes.js";
import adminRouter from "./adminRoutes.js";
import userRouter from "./userRoutes.js";
import express from "express";
import { inngest, functions } from "../inngest/index.js";
import { serve } from "inngest/express";

const router = express.Router();

router.get("/", (req, res) => res.send("Server is Live!"));
router.use("/show", showRouter);
router.use("/booking", bookingRouter);
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/api/inngest", serve({ client: inngest, functions }));

export default router;
