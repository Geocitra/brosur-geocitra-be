import 'dotenv/config'; // Paksa baca .env di Node v24
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Memulai proses Sync Engine (Auto-Discovery Seeder)...');

    // Menggunakan process.cwd() agar path selalu stabil berapapun kedalaman foldernya saat script dipanggil
    const dataDir = path.join(process.cwd(), 'data', 'brosur');

    // 1. Cek apakah folder tempat penyimpanan JSON eksis
    if (!fs.existsSync(dataDir)) {
        console.log(`⚠️ Folder ${dataDir} tidak ditemukan. Membuat folder baru secara otomatis...`);
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('✅ Folder berhasil dibuat. Silakan tambahkan file JSON brosur lo ke dalamnya dan jalankan ulang script ini.');
        return;
    }

    // 2. Baca isi folder dan filter hanya file .json
    const files = fs.readdirSync(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
        console.log('⚠️ Tidak ada file JSON yang ditemukan di folder data/brosur/. Sync dihentikan.');
        return;
    }

    console.log(`📂 Ditemukan ${jsonFiles.length} file konfigurasi JSON. Memulai sinkronisasi ke PostgreSQL...`);

    // 3. Looping ke setiap file untuk di-parsing dan di-inject ke DB
    for (const file of jsonFiles) {
        const filePath = path.join(dataDir, file);

        try {
            // Baca isi file sebagai string
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            // Parsing string menjadi JSON Object (Contract Validation)
            const parsedData = JSON.parse(fileContent);

            // Proteksi 1: Pastikan field slug eksis sebagai Primary Identifier
            if (!parsedData.slug) {
                throw new Error(`File ${file} tidak memiliki properti wajib 'slug'. File dilewati.`);
            }

            // 4. Eksekusi Transaksional (Upsert = Update if exist, Insert if not exist)
            await prisma.productShowcase.upsert({
                where: { slug: parsedData.slug },
                update: {
                    name: parsedData.name,
                    tagline: parsedData.tagline,
                    primaryColor: parsedData.primaryColor,
                    blocks: parsedData.blocks, // Timpa seluruh array blocks dengan yang terbaru
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

        } catch (error: any) {
            // Tangkap error per file agar jika 1 file JSON rusak (typo kurung kurawal), file lain tetap ter-seed
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