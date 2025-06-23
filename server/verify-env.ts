import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const requiredEnvVars = [
  "DB_URI",
  "SESSION_SECRET",
  "ENCRYPTION_KEY",
  "LINK_SECRET_KEY",
  "DEFAULT_ADMIN_EMAIL",
  "DEFAULT_ADMIN_PASSWORD",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
];



let allGood = true;

for (const key of requiredEnvVars) {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    allGood = false;
  } 
}

if (allGood) {
  
  process.exit(0);
} else {
  process.exit(1);
}
