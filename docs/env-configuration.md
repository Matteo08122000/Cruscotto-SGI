# Configurazione Variabili d'Ambiente

## Variabili Obbligatorie

Il server richiede le seguenti variabili d'ambiente per funzionare correttamente:

### 1. Database
```env
DB_URI=mongodb://localhost:27017/isodocument
```

### 2. Chiavi di Sicurezza (CRITICHE)
```env
# Chiave per le sessioni utente (min 32 caratteri)
SESSION_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456

# Chiave per la crittografia dei documenti (min 32 caratteri)
ENCRYPTION_KEY=b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890

# Chiave per i link sicuri (min 32 caratteri) - OBBLIGATORIA
LINK_SECRET_KEY=c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab
```

### 3. Configurazione Admin
```env
DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
DEFAULT_ADMIN_PASSWORD=your-secure-admin-password
```

## Generazione Chiavi Sicure

### Metodo 1: OpenSSL
```bash
# Genera chiavi di 32 byte (64 caratteri esadecimali)
openssl rand -hex 32
```

### Metodo 2: Node.js
```bash
# Genera chiavi di 32 byte
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Metodo 3: Online Generator (solo per test)
```bash
# Usa un generatore online per test locali
# https://generate-secret.vercel.app/32
```

## File .env

Crea un file `.env` nella directory `server/` con il contenuto:

```env
# Database
DB_URI=mongodb://localhost:27017/isodocument

# Security Keys
SESSION_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
ENCRYPTION_KEY=b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890
LINK_SECRET_KEY=c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab

# Admin
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=Admin123!

# Environment
NODE_ENV=development
```

## Verifica Configurazione

```bash
# Verifica che tutte le variabili siano configurate
npm run check-env

# Se tutto ok, vedrai exit code 0
# Se mancano variabili, vedrai exit code 1
```

## Variabili Opzionali

### Google Drive API
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Email (SMTP)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Sicurezza in Produzione

1. **Mai committare il file `.env`** nel repository
2. **Usa chiavi diverse** per ogni ambiente (dev, staging, prod)
3. **Rotazione periodica** delle chiavi di sicurezza
4. **Backup sicuro** delle chiavi di produzione
5. **Accesso limitato** alle chiavi di produzione

## Troubleshooting

### Errore: "LINK_SECRET_KEY deve essere configurata"
- Verifica che il file `.env` esista
- Controlla che `LINK_SECRET_KEY` sia presente e non vuota
- Assicurati che il file `.env` sia nella directory corretta

### Errore: "Missing script: dev"
- Esegui `npm install` per installare le dipendenze
- Verifica di essere nella directory `server/`
- Controlla che `package.json` contenga lo script `dev` 