import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json" with { type: "json" };
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import passwordResetRoute from "./routes/passwordResetRoute.js";
import profileRoute from "./routes/profileRoute.js";
import taskRoute from "./routes/taskRoute.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:85",
      "http://192.168.20.31:85",
      "https://smart-dtwin.projectbase.my.id",
    ],
    credentials: true,
  }),
);
app.set("trust proxy", true);
const port = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/forgot-password", passwordResetRoute);
app.use("/profiles", profileRoute);
app.use("/task", taskRoute);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
  res.send("Welcome to the Smart Adaptive Learning Assistant API!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Penulisan Salah!");
});

app.listen(port, () => {
  console.log(`Server berjalan pada http://0.0.0.0:${port}`);
});
