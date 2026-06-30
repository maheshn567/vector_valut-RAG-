import express from "express";
import cookieParser from "cookie-parser"; // 1. Import cookie-parser
import tenantRouter from "./src/routes/tenant.route.js";
import appRouter from "./src/routes/app.route.js";
import groupRouter from "./src/routes/group.route.js";
import ragrouter from "./src/routes/rag-upload.route.js";
import llmResponseRouter from "./src/routes/llmresponse.route.js";
import conversationRouter from "./src/routes/conversation.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser()); // 2. Register cookie-parser middleware

app.use('/api/v1/tenant', tenantRouter);
app.use('/api/v1/app', appRouter);
app.use('/api/v1/group', groupRouter);
app.use('/api/v1/rag', ragrouter);
app.use('/api/v1/query', llmResponseRouter);
app.use('/api/v1/conversations', conversationRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use((req, res) => {
  return res.status(404).json({ message: "wrong endpoint or wrong method" });
});

export default app;
