# ArtiSign: Menjembatani Komunikasi dengan BISINDO

## Daftar Isi
- [Gambaran Umum](#gambaran-umum)
- [Permasalahan](#permasalahan)
- [Solusi Kami](#solusi-kami)
- [Fitur Utama](#fitur-utama)
- [Peningkatan dan Rencana Jangka Depan](#peningkatan-dan-rencana-jangka-depan)
- [Mengapa Platform Web?](#mengapa-platform-web)
- [Tumpukan Teknologi (Tech Stack)](#tumpukan-teknologi-tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Memulai (Pengaturan Lokal)](#memulai-pengaturan-lokal)
- [Penggunaan](#penggunaan)
- [Lisensi](#lisensi)
- [Kontak](#kontak)

---

## Gambaran Umum
**ArtiSign** adalah aplikasi penerjemah bertenaga AI yang bekerja secara real-time untuk menjembatani kesenjangan komunikasi antara Bahasa Indonesia dan Bahasa Isyarat Indonesia (BISINDO). Dengan memanfaatkan teknologi Visi Komputer dan pembelajaran mesin, ArtiSign bertujuan menciptakan lingkungan yang lebih inklusif bagi komunitas Tuli melalui terjemahan isyarat yang akurat, cepat, dan mudah diakses.

---

## Permasalahan
Komunitas Tuli di Indonesia menghadapi berbagai hambatan, antara lain:
- Hambatan komunikasi dalam kehidupan sehari-hari.
- Kurangnya pemahaman publik terhadap pengalaman menjadi Tuli.
- Minimnya akses terhadap media pembelajaran BISINDO.
- Keterbatasan dukungan dan representasi di layanan publik dan pendidikan.

---

## Solusi Kami
ArtiSign hadir sebagai platform web interaktif dengan fitur:
- **Deteksi BISINDO Real-time** menggunakan kamera.
- **Platform Pembelajaran Interaktif** (versi awal).
- **Terjemahan dengan model AI canggih** untuk keakuratan tinggi.

---

## Fitur Utama
- 🎥 **Deteksi Gerakan BISINDO Real-time**: Menggunakan webcam untuk menerjemahkan ke Bahasa Indonesia.
- 📚 **Pembelajaran BISINDO**: Eksplorasi isyarat bagi pemula.
- 🧠 **Model Deep Learning**: CNN, MLP, LSTM, Transformer.
- 🌐 **Aksesibilitas Universal**: Langsung diakses melalui peramban tanpa instalasi.

---

## Peningkatan dan Rencana Jangka Depan
- 📸 **Deteksi Gambar/Video Offline**.
- 🎯 **Peningkatan Akurasi Real-time**.
- 👩‍🏫 **Layanan Interpreter Manusia Terintegrasi**.
- 🧾 **Perluasan Kosakata dan Bahasa Tambahan**.
- 🤖 **Teks ke Isyarat Bertenaga AI (Future Vision)**.

---

## Mengapa Platform Web?
- ✅ **Akses Instan** tanpa instalasi.
- 🌍 **Akses Universal** dari berbagai perangkat.
- 🔄 **Pembaruan Mudah** langsung dari server.
- 🚪 **Tanpa Hambatan Masuk** (login/registrasi tidak wajib).

---

## Tech Stack

### Machine Learning (Python)
- `TensorFlow / Keras`, `MediaPipe Hands`, `OpenCV`, `Numpy`, `tensorflowjs_converter`

### Backend (Python)
- `fastApi`, `tensorflow`, `uvicorn` `ws`, `mediapipe`, `Pillow`, `aiofiles`, `python-jose`, `python-multipart`, `opencv-python`, `numpy`

### Frontend (Web)
- `HTML5`, `CSS3`, `JavaScript`
- `MediaPipe.js`, `Web Speech API`, `WebSocket`, `fetch API`. ` Reactjs`

## Memulai (Pengaturan Lokal)

### Prasyarat
- **Node.js & npm** (https://nodejs.org)
- **Python 3.9 - 3.10** (https://python.org)
- **FFMPEG** (https://ffmpeg.org/download.html)
- **Webcam**

### Instalasi
1. Kloning repositori:
```bash
git clone https://github.com/shaflykhalifap/ArtiSign.git
cd ArtiSign_Project

# 2. Tempatkan model terlatih di:
#    ArtiSign_Project/backend/models/
#    - best_bisindo_image_model.h5
#    - best_bisindo_landmark_model.h5
#    - best_bisindo_video_lstm_model.h5
#    - image_class_mapping.json
#    - video_class_mapping.json

3. Jalankan backend:
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

4. Akses frontend:
pastikan terminal di path direktori root dengan cara `cd..`
npm install
npm run build
npm run start
Buka http://localhost:3000 di browser Anda.

## Memulai (Pengaturan Lokal)

1. Deteksi BISINDO Real-time
Kunjungi http://localhost:3000

Izinkan akses kamera

Lakukan gerakan BISINDO → hasil akan tampil & dibacakan

2. Pembelajaran BISINDO (awal)
Telusuri konten interaktif di halaman utama

3. Deteksi Gambar/Video (fitur masa depan)
Navigasi ke /upload-image.html atau /upload-video.html (setelah implementasi)

4. Layanan Interpreter Manusia (rencana)
Akan tersedia setelah fitur diluncurkan

## Kontak
Untuk pertanyaan, kontribusi, atau kolaborasi:

[ArtiSign Project Capstone Team]
📧 [shaflykp305@gmail.com]
