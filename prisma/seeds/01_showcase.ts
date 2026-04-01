import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export default async function seed(prisma: PrismaClient) {
    console.log('🌱 Memulai proses seeding data Showcase secara dinamis...');

    // 1. Definisikan absolute path ke direktori data/brosur
    // process.cwd() menunjuk ke root directory dari eksekusi backend (brosur-geocitra-be)
    const dataDir = path.join(process.cwd(), 'data', 'brosur');

    // 2. Validasi eksistensi direktori
    if (!fs.existsSync(dataDir)) {
        console.error(`❌ Direktori tidak ditemukan: ${dataDir}`);
        return;
    }

    // 3. Baca semua isi direktori
    const files = fs.readdirSync(dataDir);

    // 4. Filter hanya file berekstensi .json (menghindari hidden file atau ekstensi lain)
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
        console.log('⚠️ Tidak ada file .json yang ditemukan di direktori data/brosur.');
        return;
    }

    console.log(`📦 Ditemukan ${jsonFiles.length} file konfigurasi brosur. Memproses data...`);

    // 5. Iterasi dan Upsert setiap file JSON
    for (const file of jsonFiles) {
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        try {
            // Parsing konten string menjadi JSON Object
            const payload = JSON.parse(fileContent);

            // Destructuring data untuk memetakan ke Prisma model
            // Asumsi kontrak JSON yang baku: slug, name, tagline, primaryColor, blocks
            const { slug, name, tagline, primaryColor, blocks } = payload;

            // Proteksi: Pastikan slug ada, karena ini adalah primary/unique key
            if (!slug) {
                console.warn(`⚠️ [SKIP] File ${file} dilewati karena tidak memiliki property 'slug'.`);
                continue;
            }

            console.log(`🔄 Meng-upsert data aplikasi: ${name} (${slug})`);

            // 6. Eksekusi Upsert (Update jika ada, Insert jika belum ada)
            await prisma.productShowcase.upsert({
                where: { slug: slug },
                update: {
                    name,
                    tagline,
                    primaryColor,
                    // Karena blocks bersifat JSON di skema database, kita bisa langsung melempar array object-nya
                    blocks
                },
                create: {
                    slug,
                    name,
                    tagline,
                    primaryColor,
                    blocks
                }
            });

        } catch (error) {
            // Tangkap error jika file JSON tidak valid secara syntax
            console.error(`❌ Gagal memproses file ${file}:`, error instanceof Error ? error.message : error);
        }
    }

    console.log('✅ Seeding Showcase selesai!');
}