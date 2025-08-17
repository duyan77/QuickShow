import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import indexRouter from "./routes/indexRoutes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

const app = express();
const port = 3000;

await connectDB();

app.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    myapi: "3.0.0",
    info: {
      title: "QuickShow API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"], // files containing annotations as above
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use("/", indexRouter);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
