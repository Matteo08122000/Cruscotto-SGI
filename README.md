# Cruscotto SGI - Sistema di Gestione Integrata

Un sistema completo per la gestione di documenti aziendali con integrazione Google Drive, backup automatici e notifiche intelligenti.

## 🚀 Caratteristiche Principali

- **Gestione Documenti**: Upload, organizzazione e ricerca avanzata
- **Integrazione Google Drive**: Sincronizzazione automatica bidirezionale
- **Backup Automatici**: Backup periodici con notifiche
- **Sistema di Notifiche**: Email e notifiche in-app per scadenze
- **Gestione Utenti**: Ruoli e permessi granulari
- **Interfaccia Moderna**: UI responsive con design system
- **Sicurezza Avanzata**: Autenticazione, rate limiting, validazione

## 📋 Prerequisiti

- Node.js 18+ 
- MongoDB 6+
- Google Cloud Platform account
- SMTP server per email

## 🛠️ Installazione

### 1. Clona il repository
```bash
git clone <repository-url>
cd Cruscotto-SGI-clean
```

### 2. Installa le dipendenze
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Configura le variabili d'ambiente

Crea un file `.env` nella root del progetto:

```env
# Database
DB_URI=mongodb://localhost:27017/cruscotto-sgi

# Sessione
SESSION_SECRET=your_session_secret_here

# Crittografia
ENCRYPTION_KEY=your_encryption_key_here

# Google Drive API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS
CORS_ORIGIN=http://localhost:5173

# Ambiente
NODE_ENV=development
```

### 4. Configura Google Drive API

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Abilita Google Drive API
4. Crea credenziali OAuth 2.0
5. Configura gli URI di reindirizzamento autorizzati

### 5. Avvia il server di sviluppo

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

Il server sarà disponibile su `http://localhost:5000` e il client su `http://localhost:5173`.

## 🏗️ Struttura del Progetto

```
Cruscotto-SGI-clean/
├── client/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/     # Componenti UI
│   │   ├── pages/         # Pagine dell'applicazione
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utility e configurazioni
│   └── package.json
├── server/                # Backend Node.js + Express
│   ├── models/           # Modelli Mongoose
│   ├── routes/           # Route API
│   ├── services/         # Logica di business
│   └── package.json
├── shared-types/         # Tipi TypeScript condivisi
└── docs/                # Documentazione
```

## 🔧 Configurazione Produzione

### Variabili d'ambiente per produzione

```env
NODE_ENV=production
DB_URI=mongodb://your-production-db
SESSION_SECRET=your_production_session_secret
ENCRYPTION_KEY=your_production_encryption_key
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
CORS_ORIGIN=https://yourdomain.com
```

### Build per produzione

```bash
# Build del server
cd server
npm run build

# Build del client
cd client
npm run build

# Avvia il server di produzione
cd server
npm start
```

## 🔒 Sicurezza

Il sistema implementa diverse misure di sicurezza:

- **Autenticazione**: Session-based con Passport.js
- **Rate Limiting**: Protezione contro attacchi brute force
- **Validazione Input**: Validazione lato server con Zod
- **CORS**: Configurazione sicura per cross-origin requests
- **Helmet**: Header di sicurezza HTTP
- **Crittografia**: Crittografia AES per dati sensibili

## 📚 API Documentation

### Autenticazione

- `POST /api/login` - Login utente
- `POST /api/logout` - Logout utente
- `GET /api/user` - Informazioni utente corrente
- `POST /api/register/admin` - Registrazione amministratore

### Documenti

- `GET /api/documents` - Lista documenti
- `POST /api/documents` - Upload documento
- `PUT /api/documents/:id` - Aggiorna documento
- `DELETE /api/documents/:id` - Elimina documento

### Google Drive

- `GET /api/sync` - Sincronizzazione manuale
- `POST /api/sync/start` - Avvia sincronizzazione
- `GET /api/sync/status` - Stato sincronizzazione

### Backup

- `GET /api/backup` - Lista backup
- `POST /api/backup/create` - Crea backup manuale
- `GET /api/backup/:id/download` - Download backup

## 🧪 Testing

```bash
# Test del server
cd server
npm test

# Test del client
cd client
npm test
```

## 📝 Logging

Il sistema utilizza Winston per il logging strutturato:

- **Development**: Log su console con colori
- **Production**: Log su file con rotazione giornaliera
- **Errori**: Log dettagliati con stack trace

## 🔄 Sincronizzazione Google Drive

La sincronizzazione automatica avviene ogni 15 minuti e include:

- Upload di nuovi documenti
- Aggiornamento di documenti modificati
- Sincronizzazione di metadati
- Gestione errori e retry

## 📧 Sistema di Notifiche

Il sistema invia notifiche per:

- Scadenze documenti (7 giorni prima)
- Errori di sincronizzazione
- Backup completati/falliti
- Nuovi utenti registrati

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## 🆘 Supporto

Per supporto e domande:

- 📧 Email: support@example.com
- 📖 Documentazione: `/docs`
- 🐛 Issues: GitHub Issues

## 🔄 Changelog

### v1.0.0
- ✅ Sistema base di gestione documenti
- ✅ Integrazione Google Drive
- ✅ Sistema di backup automatico
- ✅ Notifiche email
- ✅ Interfaccia utente moderna
- ✅ Sistema di autenticazione
- ✅ Rate limiting e sicurezza
