# Artisign: Penerjemah Bahasa Isyarat Indonesia (BISINDO)

Repositori ini berisi kode dan model untuk proyek Artisign, sebuah sistem penerjemah Bahasa Isyarat Indonesia (BISINDO) menggunakan teknologi Computer Vision dan Deep Learning.

## 🌟 Fitur Utama

Proyek ini memiliki beberapa kemampuan utama:
1.  **Pengenalan Isyarat Abjad Statis**: Menerjemahkan gambar atau input webcam dari isyarat abjad BISINDO ke dalam teks.
2.  **Pengenalan Isyarat Kata Dinamis**: Menerjemahkan video atau input webcam dari isyarat kata BISINDO (kosakata terbatas) ke dalam teks.
3.  **Konversi Teks ke Isyarat**: Mengonversi input teks menjadi representasi visual (gambar) dari isyarat yang sesuai (fitur dasar).
4.  **Framework Lanjutan**: Mengimplementasikan teknik-teknik modern seperti *Data Augmentation* untuk memperkaya data latih, *Validasi Silang* untuk evaluasi model yang robas, dan eksplorasi arsitektur *Transformer* untuk pemrosesan sekuensial.

## 🔧 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
* [Python 3.8+](https://www.python.org/downloads/)
* [Git](https://git-scm.com/downloads/)
* (Opsional) [Git LFS](https://git-lfs.github.com/) jika file model sangat besar.

## ⚙️ Instalasi & Setup

1.  **Clone Repositori**
    ```bash
    git clone
    cd ml-workspace
    ```

2.  **Buat Lingkungan Virtual (Recommended)**
    ```bash
    python -m venv venv
    source venv/bin/activate  # Di Windows gunakan: venv\Scripts\activate
    ```

3.  **Instal Dependensi**
    Gunakan file `requirements.txt` yang telah disediakan untuk menginstal semua library yang dibutuhkan.
    ```bash
    pip install -r requirements.txt
    ```

## 🚀 Penggunaan

Untuk menjalankan proyek, buka dan jalankan sel-sel kode di dalam notebook Jupyter:
1.  Mulai Jupyter Lab:
    ```bash
    jupyter lab
    ```
2.  Dari antarmuka Jupyter Lab, buka file `Artisign_notebook(7).ipynb`.
3.  Jalankan sel-sel kode sesuai urutan untuk melatih model, melakukan inferensi, atau mencoba fitur lainnya.

## 📁 Struktur Repositori

├── Artisign_notebook.ipynb   # Notebook utama untuk eksperimen dan pengembangan.
├── models/                      # Folder untuk menyimpan file model yang telah dilatih (.h5, .tflite, etc.).
├── README.md                    # File yang sedang Anda baca.
└── requirements.txt             # Daftar dependensi Python.

## 👥 Kontribusi

Proyek ini adalah hasil kerja tim. Untuk menjaga alur kerja yang teratur, ikuti panduan berikut:
1.  Selalu buat *branch* baru untuk setiap fitur atau perbaikan (`git checkout -b nama-fitur`).
2.  Lakukan *commit* secara berkala dengan pesan yang deskriptif.
3.  Sebelum melakukan *push*, selalu tarik perubahan terbaru dari branch `main` (`git pull origin main`).
4.  Setelah selesai, buat *Pull Request* untuk di-review oleh anggota tim lainnya sebelum di-*merge*.