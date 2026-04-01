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
exports.default = seed;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function seed(prisma) {
    console.log('🌱 Memulai proses seeding data Showcase secara dinamis (Multi-language Support)...');
    const dataDir = path.join(process.cwd(), 'data', 'brosur');
    if (!fs.existsSync(dataDir)) {
        console.error(`❌ Direktori tidak ditemukan: ${dataDir}`);
        return;
    }
    const files = fs.readdirSync(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    if (jsonFiles.length === 0) {
        console.log('⚠️ Tidak ada file .json yang ditemukan di direktori data/brosur.');
        return;
    }
    console.log(`📦 Ditemukan ${jsonFiles.length} file konfigurasi brosur (ID & EN). Memproses data...`);
    for (const file of jsonFiles) {
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
            const payload = JSON.parse(fileContent);
            const { slug, name, tagline, primaryColor, blocks } = payload;
            if (!slug || !name) {
                console.warn(`⚠️ [SKIP] File ${file} dilewati karena property 'slug' atau 'name' tidak ditemukan.`);
                continue;
            }
            const isEnglish = slug.endsWith('-en');
            const langLabel = isEnglish ? '🇬🇧 EN' : '🇮🇩 ID';
            console.log(`🔄 [${langLabel}] Meng-upsert data aplikasi: ${name} (${slug})`);
            await prisma.productShowcase.upsert({
                where: { slug: slug },
                update: {
                    name,
                    tagline: tagline || '',
                    primaryColor: primaryColor || '#020617',
                    blocks: blocks || []
                },
                create: {
                    slug,
                    name,
                    tagline: tagline || '',
                    primaryColor: primaryColor || '#020617',
                    blocks: blocks || []
                }
            });
        }
        catch (error) {
            console.error(`❌ Gagal memproses file ${file}:`, error instanceof Error ? error.message : error);
        }
    }
    console.log('✅ Seeding Showcase selesai! Database telah disinkronisasi dengan file JSON terbaru.');
}
//# sourceMappingURL=01_showcase.js.map