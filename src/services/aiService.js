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
          `${index + 1}. ${t.task_name} - Deadline: ${t.deadline} - Prioritas: ${t.prioritas} - Progres: ${t.progres}%`,
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
        "total_jam_belajar": "number",
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

export const generateChatWithAI = async (history) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const formattedHistory = history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.pesan }],
  }));

  const chatContext = formattedHistory.slice(0, -1);
  const lastUserMessage =
    formattedHistory[formattedHistory.length - 1].parts[0].text;

  const chat = model.startChat({
    history: chatContext,
  });

  const result = await chat.sendMessage(lastUserMessage);
  return result.response.text();
};

export const generateMaterialSummaryWithAI = async (fileData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    Analisis materi pembelajaran berikut secara mendalam.
    
    ATURAN PENGERJAAN AI:
    1. Ringkasan WAJIB dibuat padat (tepat 2-3 paragraf).
    2. WAJIB mendeteksi dan menggunakan bahasa yang SAMA dengan bahasa mayoritas pada teks/materi yang diberikan (Misal: Jika materi bahasa Inggris, kembalikan JSON dalam bahasa Inggris).
    3. Gunakan gaya bahasa yang edukatif, netral, dan mudah dipahami oleh semua kalangan pembaca (baik pelajar, mahasiswa, maupun profesional).
    4. Semua "poin_penting" dan "kata_kunci" HARUS diekstrak secara akurat berdasarkan fakta nyata di dalam materi. JANGAN menambahkan informasi di luar konteks materi (Dilarang Halusinasi).
    5. Pilih maksimal 5-7 "kata_kunci" yang mewakili konsep utama dari materi ini.
    6. KEMBALIKAN HANYA FORMAT JSON YANG VALID SESUAI SKEMA DI BAWAH, TANPA KATA PENGANTAR, TANPA KATA PENUTUP, DAN TANPA FORMATTING MARKDOWN BLOCK CODE (\`\`\`).

    SKEMA OUPUT JSON:
    {
      "ringkasan": "string",
      "poin_penting": ["string", "string"],
      "kata_kunci": ["string", "string"]
    }
  `;

  let parts = [];

  if (fileData.type === "text") {
    parts = [prompt, `TEKS MATERI: "${fileData.content}"`];
  } else if (fileData.type === "image") {
    parts = [
      prompt,
      {
        inlineData: {
          data: fileData.content,
          mimeType: fileData.mimeType,
        },
      },
    ];
  }

  const result = await model.generateContent(parts);
  let aiText = result.response.text();

  aiText = aiText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(aiText);
};

export const generateQuizWithAI = async (ringkasanMateri) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      Kamu adalah EduFlow AI, asisten pembuat soal akademik.
      Buatkan TEPAT 10 soal kuis pilihan ganda (A, B, C, D) berdasarkan ringkasan materi berikut.

      RINGKASAN MATERI:
      "${ringkasanMateri}"

      ATURAN:
      1. WAJIB membuat tepat 10 pertanyaan.
      2. Tipe soal harus "Pilihan Ganda".
      3. Format 'kunci_jawaban' hanya boleh berisi satu huruf yang benar (A, B, C, atau D).
      4. Sertakan 'pembahasan' yang singkat, padat, dan jelas.
      5. KEMBALIKAN HANYA FORMAT JSON, TANPA FORMATTING MARKDOWN (\`\`\`).

      FORMAT JSON YANG WAJIB DIGUNAKAN (ARRAY OF OBJECTS):
      [
        {
          "tipe_soal": "Pilihan Ganda",
          "pertanyaan": "Pertanyaan beserta opsi A, B, C, D di dalamnya...",
          "kunci_jawaban": "A",
          "pembahasan": "Alasan kenapa A benar..."
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error di aiService (generateQuizWithAI):", error);
    throw new Error("Gagal generate soal kuis dari Gemini API");
  }
};
