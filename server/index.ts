import express, { type Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { mongoStorage } from "./mongo-storage";
import logger, { logRequest, logError } from "./logger";
import { setupSecurity, setupCSRF } from "./security";
import { setupAuth } from "./auth";

logger.info("Avvio server..."); // LOG INIZIALE

// Carica le variabili d'ambiente prima di ogni altro import.
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config();
}

const app = express();

// ✅ CORS config
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permetti richieste senza origin (es. Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Inizializza la gestione delle sessioni prima del CSRF.
setupAuth(app);

// Inizializza la protezione CSRF dopo le sessioni.
setupCSRF(app);

// Applica le misure di sicurezza solo in produzione
if (process.env.NODE_ENV === "production") {
  setupSecurity(app);
}

// ✅ Logging API strutturato
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Log strutturato per le richieste API
      logRequest(req, res, duration);
    }
  });

  next();
});

// Route di esempio per /api/user (GET)
app.get("/api/user", (req, res) => {
  res.json({ user: { id: 1, name: "Mario Rossi" } });
});

// Route di esempio per /api/auth (POST)
app.post("/api/auth", (req, res) => {
  res.json({ success: true, token: "abc123" });
});

// Handler globale per tutte le API non trovate (risponde sempre in JSON)
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

(async () => {
  try {
    logger.info("Connessione a MongoDB...");
    // ✅ Connessione MongoDB
    await mongoStorage.connect();

    logger.info("Correzione documenti clientId...");
    // Correggi i documenti esistenti
    await mongoStorage.fixDocumentsClientId();

    logger.info("Importo e registro le routes...");
    // ✅ IMPORTA ORA registerRoutes DOPO dotenv.config()
    const { registerRoutes } = await import("./routes");
    const server = await registerRoutes(app);

    // ✅ Registra le route di backup
    logger.info("Registro le route di backup...");
    const { registerBackupRoutes } = await import("./backup-routes");
    registerBackupRoutes(app);

    // ✅ Middleware per gestione errori centralizzata
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      // Log dell'errore con contesto completo
      logError(err, {
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: (req as any).user?.id || 'anonymous',
        statusCode: status,
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      res.status(status).json({ message });
    });

    // ✅ Avvia sincronizzazione automatica per tutti i client
    logger.info("Avvio sincronizzazione automatica...");
    const { startAutomaticSyncForAllClients } = await import("./google-drive");
    startAutomaticSyncForAllClients();
    logger.info("Sincronizzazione automatica avviata (ogni 15 minuti)");

    // ✅ Avvia controllo periodico scadenze documentali (notifiche automatiche)
    const { startExpirationChecks } = await import("./notification-service");
    startExpirationChecks();

    // Usa la porta fornita da Render, altrimenti usa 5000 come fallback
    const port = Number(process.env.PORT) || 5000;

    // Semplifichiamo la chiamata a listen per massima compatibilità
    server.listen(port, "0.0.0.0", () => {
      logger.info(`Server avviato su porta ${port}`, {
        environment: process.env.NODE_ENV,
        port,
        host: "0.0.0.0",
      });
    });
  } catch (error) {
    logError(error as Error, {
      context: "Server startup",
      environment: process.env.NODE_ENV,
    });
    process.exit(1);
  }
})();
