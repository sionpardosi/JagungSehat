const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const hashedPassword = await bcrypt.hash('Rafiandrea123', 12);

    const admin = await prisma.user.upsert({
        where: { email: 'rafiandrea@gmail.com' },
        update: {},
        create: {
            username: 'rafiandrea',
            email: 'rafiandrea@gmail.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    console.log('Created admin user:', admin);

    const diseases = [
        {
            name: 'bercak',
            title: 'Bercak Abu-abu (Grey Leaf Spot)',
            description: 'Penyakit jamur yang disebabkan oleh Cercospora zeae-maydis, menciptakan lesi persegi panjang yang dibatasi oleh urat daun. Berkembang pada kondisi kelembaban tinggi dan suhu hangat (21-30°C).',
            symptoms: 'Lesi memanjang berbentuk persegi panjang, berwarna abu-abu hingga coklat muda, dibatasi oleh urat daun. Lesi berkembang dari daun bawah ke atas dan dapat bergabung menyebabkan nekrosis daun yang luas.',
            treatment: 'Terapkan fungisida berbahan aktif azoksistrobin, propikonazol, atau tebukonazol. Praktikkan rotasi tanaman non-graminae selama 2-3 tahun. Kelola sisa tanaman dengan pengolahan tanah atau pembakaran. Gunakan varietas tahan dan hindari penanaman terlalu rapat untuk sirkulasi udara optimal.'
        },
        {
            name: 'hawar',
            title: 'Hawar Daun Utara (Northern Corn Leaf Blight)',
            description: 'Penyakit jamur yang disebabkan oleh Setosphaeria turcica (Exserohilum turcicum), menyebabkan lesi besar memanjang pada daun jagung. Berkembang optimal pada kelembaban tinggi dan suhu sedang (18-27°C).',
            symptoms: 'Lesi besar berbentuk elips atau memanjang (2.5-15 cm), berwarna abu-abu kehijauan dengan tepi coklat gelap yang jelas. Lesi berkembang dari daun bawah, dapat bergabung dan menyebabkan kematian daun prematur.',
            treatment: 'Gunakan varietas tahan dengan gen Ht1, Ht2, atau Ht3. Rotasi tanaman dengan kedelai atau tanaman non-graminae. Aplikasi fungisida strobilurin (azoksistrobin) atau triazol (propikonazol, tebukonazol) pada stadium V6-V8 atau saat gejala awal muncul. Kelola sisa tanaman dan pastikan drainase yang baik.'
        },
        {
            name: 'karat',
            title: 'Karat Jagung (Common Rust)',
            description: 'Penyakit jamur yang disebabkan oleh Puccinia sorghi, menghasilkan pustula kecil berwarna oranye hingga coklat kemerahan. Menyebar melalui spora yang terbawa angin, berkembang pada suhu sedang (16-24°C) dan kelembaban tinggi.',
            symptoms: 'Pustula kecil bulat hingga memanjang (0.2-2 mm), berwarna oranye keemasan hingga coklat kayu manis pada kedua permukaan daun. Pustula dapat pecah mengeluarkan spora berwarna oranye. Pada infeksi berat, daun menguning dan mengering.',
            treatment: 'Terapkan fungisida sistemik mengandung propikonazol, azoksistrobin, atau kombinasi strobilurin + triazol (pyraclostrobin + metconazole). Aplikasi pada stadium V8-VT atau saat 5-10% tanaman terinfeksi. Pastikan sirkulasi udara baik dengan jarak tanam optimal. Gunakan varietas tahan dan hindari pemupukan nitrogen berlebihan.'
        },
        {
            name: 'sehat',
            title: 'Tanaman Jagung Sehat',
            description: 'Kondisi optimal tanaman jagung tanpa tanda-tanda penyakit, menunjukkan pertumbuhan normal dan vigor yang baik. Daun berfungsi maksimal untuk fotosintesis dan pertumbuhan tanaman.',
            symptoms: 'Daun berwarna hijau cerah hingga hijau tua merata, tidak ada bercak, lesi, atau perubahan warna (diskolorasi). Permukaan daun halus, tidak ada pustula atau nekrosis. Pertumbuhan tanaman normal sesuai stadium.',
            treatment: 'Tidak diperlukan pengobatan khusus. Lanjutkan praktik budidaya yang baik: pemupukan berimbang, pengairan optimal, pengendalian gulma. Lakukan pemantauan rutin mingguan untuk deteksi dini penyakit. Pertahankan sanitasi lahan dan rotasi tanaman untuk pencegahan.'
        }
    ];


    for (const diseaseData of diseases) {
        const disease = await prisma.disease.upsert({
            where: { name: diseaseData.name },
            update: diseaseData,
            create: diseaseData
        });
        console.log('Created disease:', disease.name);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
