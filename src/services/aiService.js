import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateJadwalWithAI = async (tasks, profile, startTime) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const taskListString = tasks
      .map(
        (t, index) =>
          `${index + 1}. ${t.task_name} (MK: ${t.mata_kuliah}) - Deadline: ${new Date(t.deadline).toLocaleString()} - Prioritas: ${t.prioritas} - Progres: ${t.progres || 0}%`,
      )
      .join("\n");

    const prompt = `
      Kamu adalah EduFlow AI, asisten perencana jadwal belajar akademik yang pintar dan adaptif.
      Buatkan jadwal belajar harian yang optimal untuk hari ini berdasarkan profil pengguna dan tugas yang belum selesai.

      DATA PROFIL PENGGUNA:
      - Jenjang Pendidikan: ${profile.jenjang_pendidikan}
      - Jurusan: ${profile.jurusan}
      - Target Akademik: ${profile.target_akademik}
      - Waktu Belajar Harian: ${profile.jam_belajar_harian} jam

      KONFIGURASI WAKTU:
      - Jam Mulai: ${startTime}
      - Total Durasi: ${profile.jam_belajar_harian} jam (WAJIB DIPATUHI)

      DAFTAR TUGAS BELUM SELESAI: ${taskListString}

      DATA PROGRES TUGAS (PANDUAN TAHAP PENGERJAAN):
      - Gunakan nilai 'Progres' untuk menentukan tahap pengerjaan.
      - 0% - 20%: Tahap Riset/Brainstorming.
      - 21% - 60%: Tahap Implementasi/Coding.
      - 61% - 90%: Tahap Review/Penyelesaian.
      - 91% - 100%: Tahap Finalisasi.
      - JANGAN MENGULANG tahap pengerjaan yang sudah dilewati berdasarkan nilai 'Progres' tersebut.

      ATURAN:
      1. WAJIB mulai pada jam ${startTime}.
      2. WAJIB menyesuaikan total durasi pengerjaan agar tepat ${profile.jam_belajar_harian} jam.
      3. Prioritaskan tugas dengan deadline paling dekat dan prioritas tinggi.
      4. Selalu sertakan waktu istirahat (break) di antara sesi belajar yang panjang.
      5. KEMBALIKAN HANYA FORMAT JSON, TANPA FORMATTING MARKDOWN (\`\`\`).

      FORMAT JSON YANG WAJIB DIGUNAKAN:
      {
        "target_harian": "string",
        "total_jam_belajar_direncanakan": "number",
        "jadwal": [
          {
            "waktu": "HH:mm - HH:mm",
            "aktivitas": "string",
            "prioritas": "tinggi/sedang/rendah/-",
            "tipe": "Fokus/Break/Membaca/dll"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonJadwal = JSON.parse(responseText);

    return jsonJadwal;
  } catch (error) {
    console.error("Error di aiService (generateJadwalWithAI):", error);
    throw new Error("Gagal berkomunikasi dengan Gemini API");
  }
};
