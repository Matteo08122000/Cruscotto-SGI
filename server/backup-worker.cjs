"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
var fs = require("fs");
var path = require("path");
var mongoose_1 = require("mongoose");
var mongoose_models_1 = require("./models/mongoose-models");
var dotenv = require("dotenv");
// 2. Carica le variabili d'ambiente specifiche per il worker
if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: ".env.production" });
}
else {
    dotenv.config();
}
// 3. Funzione per connettersi al database
function connectToDB() {
    return __awaiter(this, void 0, void 0, function () {
        var dbUri, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(mongoose_1.default.connection.readyState === 0)) return [3 /*break*/, 4];
                    dbUri = process.env.DB_URI;
                    if (!dbUri) {
                        throw new Error("La variabile d'ambiente DB_URI non è configurata nel worker.");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, mongoose_1.default.connect(dbUri)];
                case 2:
                    _a.sent();
                    console.log('Worker connesso a MongoDB.');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Errore di connessione a MongoDB nel worker:', error_1);
                    throw error_1; // Lancia l'errore per fermare l'esecuzione
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Funzione per disconnettersi dal database
function disconnectFromDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(mongoose_1.default.connection.readyState !== 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 1:
                    _a.sent();
                    console.log('Worker disconnesso da MongoDB.');
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Funzione helper per serializzare correttamente gli errori
function serializeError(error) {
    if (error instanceof Error) {
        // Se è un'istanza di Error, includi messaggio e stack
        return error.message + (error.stack ? "\nStack: ".concat(error.stack) : '');
    }
    if (typeof error === 'object' && error !== null) {
        // Prova a convertirlo in JSON, gestendo i riferimenti circolari
        try {
            return JSON.stringify(error, Object.getOwnPropertyNames(error));
        }
        catch (e) {
            // Se fallisce, usa la conversione standard
            return String(error);
        }
    }
    // Per tipi primitivi
    return String(error);
}
function createBackup() {
    return __awaiter(this, void 0, void 0, function () {
        var backupDir, timestamp, backupPath, _a, users, documents, logs, clients, companyCodes, counters, data, error_2, errorMsg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 8]);
                    // 4. Assicurati che la connessione sia attiva prima di operare
                    return [4 /*yield*/, connectToDB()];
                case 1:
                    // 4. Assicurati che la connessione sia attiva prima di operare
                    _b.sent();
                    backupDir = path.join(process.cwd(), "backups");
                    return [4 /*yield*/, fs.promises.mkdir(backupDir, { recursive: true })];
                case 2:
                    _b.sent();
                    timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                    backupPath = path.join(backupDir, "backup_all_".concat(timestamp, ".json"));
                    return [4 /*yield*/, Promise.all([
                            mongoose_models_1.UserModel.find().lean().exec(),
                            mongoose_models_1.DocumentModel.find().lean().exec(),
                            mongoose_models_1.LogModel.find().lean().exec(),
                            mongoose_models_1.ClientModel.find().lean().exec(),
                            mongoose_models_1.CompanyCodeModel.find().lean().exec(),
                            mongoose_models_1.Counter.find().lean().exec()
                        ])];
                case 3:
                    _a = _b.sent(), users = _a[0], documents = _a[1], logs = _a[2], clients = _a[3], companyCodes = _a[4], counters = _a[5];
                    data = {
                        users: users,
                        documents: documents,
                        logs: logs,
                        clients: clients,
                        companyCodes: companyCodes,
                        counters: counters,
                        timestamp: new Date().toISOString(),
                        version: "1.1",
                    };
                    return [4 /*yield*/, fs.promises.writeFile(backupPath, JSON.stringify(data, null, 2), "utf8")];
                case 4:
                    _b.sent();
                    return [2 /*return*/, { success: true, backupPath: backupPath }];
                case 5:
                    error_2 = _b.sent();
                    // Logga l'errore dettagliato nella console del server per il debug
                    console.error("!!! Errore critico nel worker durante createBackup:", error_2);
                    errorMsg = serializeError(error_2);
                    return [2 /*return*/, {
                            success: false,
                            error: "Errore durante la creazione del backup nel worker: ".concat(errorMsg),
                        }];
                case 6: 
                // 5. Chiudi la sessione e la connessione
                return [4 /*yield*/, disconnectFromDB()];
                case 7:
                    // 5. Chiudi la sessione e la connessione
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function restoreFromBackup(backupPath) {
    return __awaiter(this, void 0, void 0, function () {
        var session, backupData, insertPromises, error_3, errorMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 4. Assicurati che la connessione sia attiva prima di operare
                return [4 /*yield*/, connectToDB()];
                case 1:
                    // 4. Assicurati che la connessione sia attiva prima di operare
                    _a.sent();
                    return [4 /*yield*/, mongoose_1.default.startSession()];
                case 2:
                    session = _a.sent();
                    session.startTransaction();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, 9, 11]);
                    backupData = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
                    if (!backupData.users || !backupData.documents || !backupData.logs ||
                        !backupData.clients || !backupData.companyCodes || !backupData.counters) {
                        throw new Error("Il file di backup è incompleto o non valido.");
                    }
                    // Elimina tutto in parallelo
                    return [4 /*yield*/, Promise.all([
                            mongoose_models_1.UserModel.deleteMany({}, { session: session }),
                            mongoose_models_1.DocumentModel.deleteMany({}, { session: session }),
                            mongoose_models_1.LogModel.deleteMany({}, { session: session }),
                            mongoose_models_1.ClientModel.deleteMany({}, { session: session }),
                            mongoose_models_1.CompanyCodeModel.deleteMany({}, { session: session }),
                            mongoose_models_1.Counter.deleteMany({}, { session: session })
                        ])];
                case 4:
                    // Elimina tutto in parallelo
                    _a.sent();
                    insertPromises = [];
                    if (backupData.users.length > 0)
                        insertPromises.push(mongoose_models_1.UserModel.insertMany(backupData.users, { session: session }));
                    if (backupData.documents.length > 0)
                        insertPromises.push(mongoose_models_1.DocumentModel.insertMany(backupData.documents, { session: session }));
                    if (backupData.logs.length > 0)
                        insertPromises.push(mongoose_models_1.LogModel.insertMany(backupData.logs, { session: session }));
                    if (backupData.clients.length > 0)
                        insertPromises.push(mongoose_models_1.ClientModel.insertMany(backupData.clients, { session: session }));
                    if (backupData.companyCodes.length > 0)
                        insertPromises.push(mongoose_models_1.CompanyCodeModel.insertMany(backupData.companyCodes, { session: session }));
                    if (backupData.counters.length > 0)
                        insertPromises.push(mongoose_models_1.Counter.insertMany(backupData.counters, { session: session }));
                    return [4 /*yield*/, Promise.all(insertPromises)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, session.commitTransaction()];
                case 6:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
                case 7:
                    error_3 = _a.sent();
                    return [4 /*yield*/, session.abortTransaction()];
                case 8:
                    _a.sent();
                    console.error("!!! Errore critico nel worker durante restoreFromBackup:", error_3);
                    errorMsg = serializeError(error_3);
                    return [2 /*return*/, { success: false, error: "Errore durante il ripristino nel worker: ".concat(errorMsg) }];
                case 9: 
                // 5. Chiudi la sessione e la connessione
                return [4 /*yield*/, session.endSession()];
                case 10:
                    // 5. Chiudi la sessione e la connessione
                    _a.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// Gestione messaggi dal thread principale
if (worker_threads_1.parentPort) {
    worker_threads_1.parentPort.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
        var result, _a, error_4, errorMsg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, 8, 10]);
                    result = void 0;
                    _a = message.type;
                    switch (_a) {
                        case 'CREATE_BACKUP': return [3 /*break*/, 1];
                        case 'RESTORE_BACKUP': return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, createBackup()];
                case 2:
                    result = _b.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, restoreFromBackup(message.backupPath)];
                case 4:
                    result = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    result = { success: false, error: 'Tipo di operazione non riconosciuto' };
                    _b.label = 6;
                case 6:
                    worker_threads_1.parentPort.postMessage(result);
                    return [3 /*break*/, 10];
                case 7:
                    error_4 = _b.sent();
                    errorMsg = serializeError(error_4);
                    worker_threads_1.parentPort.postMessage({
                        success: false,
                        error: errorMsg
                    });
                    return [3 /*break*/, 10];
                case 8: 
                // 6. Disconnetti dal DB dopo ogni operazione per non lasciare connessioni appese
                return [4 /*yield*/, disconnectFromDB()];
                case 9:
                    // 6. Disconnetti dal DB dopo ogni operazione per non lasciare connessioni appese
                    _b.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); });
}
