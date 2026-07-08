# Adapler (Smart Adaptive Learning Assistant) - Backend API

Adapler adalah _platform_ asisten pembelajaran adaptif cerdas yang dirancang untuk pelajar tingkat menengah (SMP/SMA) hingga mahasiswa. _Backend_ ini menyediakan layanan API yang kuat dan aman untuk mengelola data pengguna, tugas akademik, serta mengintegrasikan kecerdasan buatan untuk merancang jadwal belajar dan merangkum materi secara otomatis.

## 🚀 Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Database:** PostgreSQL (Multi-Schema Architecture)
- **ORM:** Prisma ORM
- **Authentication:** JSON Web Token (JWT)
- **AI Integration:** Google Gemini API
- **Containerization:** Docker
- **API Documentation:** Swagger (OpenAPI)

## ✨ Fitur Utama

- **Autentikasi Aman:** Sistem _login_ dan registrasi menggunakan enkripsi _password_ dan JWT.
- **Task Management & AI Study Planner:** Endpoint untuk mengelola tugas harian (_Create, Read, Update, Delete_) yang terintegrasi langsung dengan AI untuk menyusun jadwal belajar adaptif secara otomatis.
- **Material Summary & Quiz Generator:** Pemrosesan dokumen (PDF, PPT, DOCX, Image) untuk menghasilkan rangkuman materi dan soal latihan.
- **AI Tutor & Insights:** Layanan tanya jawab interaktif dan analisis progres belajar pengguna.
- **Multi-Schema Database:** Isolasi data yang rapi dan terstruktur menggunakan _multi-schema_ PostgreSQL.

## 📋 Prasyarat (Prerequisites)

Sebelum menjalankan proyek ini, pastikan perangkat Anda telah menginstal:

- [Node.js](https://nodejs.org/) (versi 18 atau terbaru)
- [PostgreSQL](https://www.postgresql.org/)
- Akun [Google AI Studio](https://aistudio.google.com/) untuk mendapatkan _API Key_ Gemini.

## 🛠️ Instalasi & Konfigurasi Lokal

**1. Kloning Repositori**

```bash
git clone [https://github.com/rifall88/adapler-backend.git](https://github.com/rifall88/adapler-backend.git)
cd adapler-backend
```
