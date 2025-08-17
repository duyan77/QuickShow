import showRouter from "./showRoutes.js";
import bookingRouter from "./bookingRoutes.js";
import adminRouter from "./adminRoutes.js";
import userRouter from "./userRoutes.js";
import express from "express";
import { inngest, functions } from "../inngest/index.js";
import { serve } from "inngest/express";
import { stripeWebhooks } from "../controllers/stripeWebhooks.js";

const router = express.Router();
router.get("/", (req, res) => res.send("Server is Live!"));
app.use("/show", showRouter);
app.use("/booking", bookingRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
router.use("/api/inngest", serve({ client: inngest, functions }));
router.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

export default router;
