import cron from "node-cron";
import { database } from "./database.js";
import { client } from "./whatsapp.js";
import { logger } from "./logging.js";

async function cronStart() {
  cron.schedule("0 * * * *", function () {
    checkTugas();
    checkJadwalKuliah();
  });
}

async function checkTugas() {
  const now = new Date();
  const fourHoursLater = new Date();
  fourHoursLater.setHours(now.getHours() + 3);

  const tugas = await database.tugas.findMany({
    where: {
      deadline: {
        gte: now,
        lt: fourHoursLater,
      },
    },
  });

  if (tugas.length > 0) {
    const users = await database.user.findMany();

    await Promise.all(
      users.map(async (user) => {
        const userNumber = `62${user.whatsapp}@c.us`;
        for (const t of tugas) {
          const mataKuliah = await database.mata_kuliah.findUnique({
            where: {
              id: t.mata_kuliah_id,
            },
          });

          const deadlineFormatted = new Date(t.deadline).toLocaleString();

          try {
            await client.sendMessage(
              userNumber,
              `
Hello ${user.nama},
Jangan Lupa tugas berikut ya

Nama Tugas : ${t.nama_tugas}
Mata Kuliah : ${mataKuliah.nama}
Dosen Pengampu : ${mataKuliah.dosen}
Deadline : ${deadlineFormatted}
        `
            );
          } catch (error) {
            logger.error(error.message);
          }
        }
      })
    );
  } else {
    console.log("Tidak ada tugas dalam 4 jam ke depan.");
  }
}

async function checkJadwalKuliah() {
  const now = new Date();
  const date = new Date();
  date.setHours(now.getHours() + 1);

  // Mendapatkan jam dan menit dari waktu sekarang dan satu jam ke depan
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const nextHour = date.getHours();
  const nextMinute = date.getMinutes();
  const day = now.getDay(); // Mendapatkan hari saat ini

  // Mengambil semua jadwal pada hari yang sama
  const jadwalKuliahList = await database.jadwal_kuliah.findMany({
    where: {
      hari: day,
    },
  });

  // Memfilter jadwal berdasarkan waktu secara manual tanpa memandang tanggal
  const jadwalKuliah = jadwalKuliahList.find((jadwal) => {
    const jamMasuk = new Date(jadwal.jam_masuk);
    const jamMasukHour = jamMasuk.getHours();
    const jamMasukMinute = jamMasuk.getMinutes();

    // Perbandingan jam dan menit secara manual
    const isWithinTimeRange =
      (jamMasukHour === nextHour && jamMasukMinute === 0) ||
      (jamMasukHour === nextHour && jamMasukMinute === 30) || // Tambahkan logika untuk mendeteksi batas waktu tepat pada jam berikutnya
      ((jamMasukHour > currentHour ||
        (jamMasukHour === currentHour && jamMasukMinute >= currentMinute)) &&
        (jamMasukHour < nextHour ||
          (jamMasukHour === nextHour && jamMasukMinute < nextMinute)));

    return isWithinTimeRange;
  });
  if (jadwalKuliah) {
    const mataKuliah = await database.mata_kuliah.findUnique({
      where: {
        id: jadwalKuliah.mata_kuliah_id,
      },
    });

    const users = await database.user.findMany();
    await Promise.all(
      users.map(async (user) => {
        try {
          await client.sendMessage(
            `62${user.whatsapp}@c.us`,
            `
Halo ${user.nama},
Jangan Lupa kuliah hari ini
Berikut Jadwalnya

Mata Kuliah : ${mataKuliah.nama}
Dosen Pengampu : ${mataKuliah.dosen}
SKS : ${mataKuliah.sks}
Kelas : ${jadwalKuliah.ruang}
Jam Masuk : ${new Date(jadwalKuliah.jam_masuk).toTimeString()}
Jam Keluar : ${new Date(jadwalKuliah.jam_keluar).toTimeString()}
          `
          );
        } catch (error) {
          logger.error(error.message);
        }
      })
    );
  }
}

export { cronStart };
