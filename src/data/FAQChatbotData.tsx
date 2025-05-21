interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "apa itu ai chatbot?",
    answer:
      "ai chatbot adalah asisten pintar yang bisa bantu kamu tanya-tanya soal bahasa isyarat. kamu bisa ngobrol, cari tahu arti gerakan, atau belajar dasar-dasar komunikasi dengan teman tuli — semuanya lebih mudah lewat bantuan chatbot ini!",
  },
  {
    question: "manfaat ai chatbot?",
    answer:
      "ai chatbot punya banyak manfaat! Kamu bisa belajar bahasa isyarat kapan saja tanpa perlu guru, mencari arti gerakan dengan cepat, berlatih komunikasi langsung, dan mendapat bantuan instan saat bicara dengan teman tuli. Chatbot juga terus belajar, jadi semakin sering dipakai semakin pintar membantu kamu!",
  },
  {
    question: "apakah privasi terjaga?",
    answer:
      "tentu saja! kami sangat menghargai privasi dan keamanan data pengguna. setiap percakapan atau data yang Anda masukkan tidak dikirim ke server manapun, melainkan hanya tersimpan secara lokal di perangkat Anda melalui local storage. dengan demikian, anda memiliki kendali penuh atas data pribadi anda. kami juga tidak melakukan pelacakan atau penyimpanan informasi pribadi tanpa izin.",
  },
];

export default faqs;
