import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/audit_logs", (req, res) => {
    // In a real DB, you'd fetch from audit_logs table
    res.json([]); // Return empty list for now
  });

  app.post("/api/audit_logs", (req, res) => {
    const { userId, action, targetType, targetId, details } = req.body;
    // Log to console for now
    console.log(`[AuditLog] User: ${userId}, Action: ${action}, Target: ${targetType} (${targetId}), Details: ${details}`);
    // Ideally, insert into a real DB here
    res.json({ success: true });
  });

  app.post("/api/opportunities", (req, res) => {
    const { payload, userId } = req.body;
    // Log to audit_logs (simulated DB call for now)
    console.log(`[AuditLog] User: ${userId}, Action: Create Opportunity, Details: ${JSON.stringify(payload)}`);
    // ... proceed to save to DB ...
    res.json({ success: true, id: "new-id" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
