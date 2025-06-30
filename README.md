# ArtiSign: Menjembatani Komunikasi dengan BISINDO

## Daftar Isi
- [Gambaran Umum](#gambaran-umum)
- [Permasalahan](#permasalahan)
- [Solusi Kami](#solusi-kami)
- [Fitur Utama](#fitur-utama)
- [Peningkatan dan Rencana Jangka Depan](#peningkatan-dan-rencana-jangka-depan)
- [Mengapa Platform Web?](#mengapa-platform-web)
- [Tech Stack](#tumpukan-teknologi-tech-stack)
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
- `HTML5`, `CSS3`, `JavaScript`, `TypeScript`
- `Webpack`, `Tailwind`, `MediaPipe.js`, `WebSpeech API`, `WebSocket`, `Axios`. ` Reactjs`, ` Threejs`

## Memulai di Lokal ataupun mulai langsung di website-nya)

### Prasyarat
- **Node.js & npm** (https://nodejs.org)
- **Python 3.9 - 3.10** (https://python.org)
- **FFMPEG** (https://ffmpeg.org/download.html)
- **Webcam**

### Instalasi Local
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

#3. Jalankan backend:
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 4. Akses frontend:
# pastikan terminal di path direktori root dengan cara cd..
npm install
npm run build
npm run start
# Buka http://localhost:3000 di browser Anda.
```

### Akses Deployment

Aplikasi ArtiSign ini juga sudah dideploy di Netlify, kalian bisa akses melalui link dibawah ini:
[https://artisign.netlify.app](https://artisign.netlify.app)


### Cara Pemakaian

1. Pergi ke browser dan akses [https://artisign.netlify.app](https://artisign.netlify.app) ataupun jika kalian di akses di local [http://localhost:3000](http://localhost:3000)
   
2. Kalian bisa eksplorasi di website tersebut, terdapat halaman beranda, halaman translate, halaman artikel, dan halaman tentang kami.
   
3. Akses halaman translate, disana terdapat input dan output.
   
4. Ada 3 fitur di halaman translate, yaitu
   - Text Bahasa Indonesia  -> 3D Bahasa Isyarat
   - Suara Bahasa Indonesia -> 3D Bahasa Isyarat
   - Kamera Bahasa Isyarat  -> Text Bahasa Indonesia

5. Akses fitur Text Bahasa Indonesia -> 3D Bahasa Isyarat

   Kalian masukkan input text bahasa indonesia, contohnya "Halo", nanti outputnya berupa gerakan 3D.

6. Akses fitur Suara Bahasa Indonesia -> 3D Bahasa Isyarat

   Untuk fitur suara to 3d ini, hanya beberapa browser saja yang support, seperti Chrome, Safari, Mozila, dll.
   Setelah itu izinkan akses suara di browser Anda dan tekan tombol suara untuk mulai berkomunikasi.

7. Akses fitur Kamera Bahasa Isyarat -> Text Bahasa Indonesia

   Untuk fitur ini, membutuhkan izin akses kamera di browser Anda dan tekan tombol kamer. Tunggu beberapa detik untuk sistem mendeteksinya.

## Saran dan Kritik
Jika Anda ada saran, feedback ataupun menemui masalah, silahkan:
- Buat [issue baru di Github](https://github.com/shaflykhalifap/ArtiSign/issues)
- Ataupun menghubungi kami di email shaflykp305@gmail.com

## Kontak
Untuk pertanyaan, kontribusi, atau kolaborasi:

📧 shaflykp305@gmail.com
