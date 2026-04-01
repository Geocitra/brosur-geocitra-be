import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export default async function seed(prisma: PrismaClient) {
    console.log('🌱 Memulai proses seeding data Showcase secara dinamis (Multi-language Support)...');

    // 1. Definisikan absolute path ke direktori data/brosur
    // process.cwd() menunjuk ke root directory dari eksekusi backend
    const dataDir = path.join(process.cwd(), 'data', 'brosur');

    // 2. Validasi eksistensi direktori (Fail-fast mechanism)
    if (!fs.existsSync(dataDir)) {
        console.error(`❌ Direktori tidak ditemukan: ${dataDir}`);
        return;
    }

    // 3. Baca semua isi direktori
    const files = fs.readdirSync(dataDir);

    // 4. Filter hanya file berekstensi .json
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
        console.log('⚠️ Tidak ada file .json yang ditemukan di direktori data/brosur.');
        return;
    }

    console.log(`📦 Ditemukan ${jsonFiles.length} file konfigurasi brosur (ID & EN). Memproses data...`);

    // 5. Iterasi dan Upsert setiap file JSON
    for (const file of jsonFiles) {
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        try {
            // Parsing konten string menjadi JSON Object
            const payload = JSON.parse(fileContent);

            // Destructuring data untuk memetakan ke Prisma model
            const { slug, name, tagline, primaryColor, blocks } = payload;

            // Proteksi: Pastikan property wajib ada sesuai skema database
            if (!slug || !name) {
                console.warn(`⚠️ [SKIP] File ${file} dilewati karena property 'slug' atau 'name' tidak ditemukan.`);
                continue;
            }

            // Analisis status bahasa untuk visualisasi log
            const isEnglish = slug.endsWith('-en');
            const langLabel = isEnglish ? '🇬🇧 EN' : '🇮🇩 ID';

            console.log(`🔄 [${langLabel}] Meng-upsert data aplikasi: ${name} (${slug})`);

            // 6. Eksekusi Upsert dengan perlindungan Fallback
            // Memastikan data yang tidak lengkap pada versi EN tidak mematahkan query
            await prisma.productShowcase.upsert({
                where: { slug: slug },
                update: {
                    name,
                    tagline: tagline || '',
                    primaryColor: primaryColor || '#020617', // Fallback warna aman
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

        } catch (error) {
            // Tangkap error jika file JSON tidak valid secara syntax (misal ada koma berlebih)
            console.error(`❌ Gagal memproses file ${file}:`, error instanceof Error ? error.message : error);
        }
    }

    console.log('✅ Seeding Showcase selesai! Database telah disinkronisasi dengan file JSON terbaru.');
}