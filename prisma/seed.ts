import 'dotenv/config'; // Paksa baca .env di Node v24
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Memulai proses seeding data Showcase...');

    // 1. Data E-Daily (Formal & Hijau)
    await prisma.productShowcase.upsert({
        where: { slug: 'edaily' },
        update: {},
        create: {
            slug: 'edaily',
            name: 'E-Daily Report',
            tagline: 'Digitalisasi Pelaporan Harian dengan Efisiensi Tinggi',
            primaryColor: '#2d5a27',
            blocks: [
                {
                    type: 'HERO_BLOCK',
                    order: 1,
                    data: {
                        title: 'E-Daily Report',
                        description: 'Tingkatkan akurasi dan kecepatan pelaporan tim lapangan Anda.',
                        imageUrl: '/assets/edaily-mockup.png'
                    }
                },
                {
                    type: 'FEATURE_BLOCK',
                    order: 2,
                    data: {
                        features: [
                            { icon: 'Zap', title: 'Real-time', desc: 'Pantau laporan detik ini juga.' },
                            { icon: 'WifiOff', title: 'Offline Mode', desc: 'Tetap bisa input walau tanpa sinyal.' }
                        ]
                    }
                },
                {
                    type: 'DOWNLOAD_BLOCK',
                    order: 3,
                    data: {
                        buttonText: 'Download Brosur E-Daily (PDF)',
                        fileUrl: '/uploads/brosur-edaily.pdf'
                    }
                }
            ]
        }
    });

    // 2. Data Rekas (Teknis & Biru)
    await prisma.productShowcase.upsert({
        where: { slug: 'rekas' },
        update: {},
        create: {
            slug: 'rekas',
            name: 'Rekas App',
            tagline: 'Sistem Retribusi Sampah Terintegrasi',
            primaryColor: '#1d4ed8',
            blocks: [
                {
                    type: 'HERO_BLOCK',
                    order: 1,
                    data: {
                        title: 'Rekas',
                        description: 'Kelola retribusi dengan transparan dan akuntabel.',
                        imageUrl: '/assets/rekas-mockup.png'
                    }
                },
                {
                    type: 'DOWNLOAD_BLOCK',
                    order: 2,
                    data: {
                        buttonText: 'Unduh Spesifikasi Teknis',
                        fileUrl: '/uploads/brosur-rekas.pdf'
                    }
                }
            ]
        }
    });

    console.log('✅ Seeding berhasil. Database siap digunakan!');
}

main()
    .catch((e) => {
        console.error('❌ Gagal Seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });