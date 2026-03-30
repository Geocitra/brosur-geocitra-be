"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🚀 Memulai proses Sync Engine (Auto-Discovery Seeder)...');
    const dataDir = path.join(process.cwd(), 'data', 'brosur');
    if (!fs.existsSync(dataDir)) {
        console.log(`⚠️ Folder ${dataDir} tidak ditemukan. Membuat folder baru secara otomatis...`);
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('✅ Folder berhasil dibuat. Silakan tambahkan file JSON brosur lo ke dalamnya dan jalankan ulang script ini.');
        return;
    }
    const files = fs.readdirSync(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    if (jsonFiles.length === 0) {
        console.log('⚠️ Tidak ada file JSON yang ditemukan di folder data/brosur/. Sync dihentikan.');
        return;
    }
    console.log(`📂 Ditemukan ${jsonFiles.length} file konfigurasi JSON. Memulai sinkronisasi ke PostgreSQL...`);
    for (const file of jsonFiles) {
        const filePath = path.join(dataDir, file);
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const parsedData = JSON.parse(fileContent);
            if (!parsedData.slug) {
                throw new Error(`File ${file} tidak memiliki properti wajib 'slug'. File dilewati.`);
            }
            await prisma.productShowcase.upsert({
                where: { slug: parsedData.slug },
                update: {
                    name: parsedData.name,
                    tagline: parsedData.tagline,
                    primaryColor: parsedData.primaryColor,
                    blocks: parsedData.blocks,
                },
                create: {
                    slug: parsedData.slug,
                    name: parsedData.name,
                    tagline: parsedData.tagline,
                    primaryColor: parsedData.primaryColor,
                    blocks: parsedData.blocks,
                }
            });
            console.log(`✅ [SYNC SUCCESS] -> Menulis data '${parsedData.slug}' (dari ${file})`);
        }
        catch (error) {
            console.error(`❌ [SYNC ERROR] Gagal memproses ${file}:`, error.message);
        }
    }
    console.log('✨ Semua proses sinkronisasi Data-Driven selesai 100%!');
}
main()
    .catch((e) => {
    console.error('❌ Terjadi kesalahan fatal pada mesin Seeder:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map