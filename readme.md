# 🌽 **Jagung Sehat**
*Intelligent Corn Disease Detection System*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Machine Learning](https://img.shields.io/badge/Machine_Learning-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![CNN](https://img.shields.io/badge/CNN-Neural_Network-blue?style=for-the-badge)](https://keras.io/)
[![DenseNet121](https://img.shields.io/badge/DenseNet121-Transfer_Learning-green?style=for-the-badge)](https://keras.io/api/applications/densenet/)

---

## 📋 **Deskripsi Proyek**

**Jagung Sehat** adalah sistem deteksi penyakit tanaman jagung yang revolusioner, dirancang khusus untuk membantu petani Indonesia dalam mengidentifikasi masalah kesehatan tanaman secara cepat dan akurat. Proyek ini mengintegrasikan kekuatan **Machine Learning** dengan **Computer Vision** untuk menciptakan solusi yang dapat diakses langsung dari lapangan.

### 🎯 **Tujuan Utama**
Proyek ini bertujuan untuk mengembangkan sistem deteksi penyakit tanaman jagung melalui **analisis citra daun** menggunakan **Convolutional Neural Network (CNN)** dan **Transfer Learning DenseNet121**. Dengan pendekatan teknologi modern ini, petani dapat:

- 🔍 **Mendeteksi penyakit daun jagung** secara otomatis dan real-time
- ⚡ **Meningkatkan efisiensi** dalam proses diagnosis penyakit di lapangan
- 🎯 **Meningkatkan akurasi** diagnosis hingga tingkat yang dapat diandalkan
- 📱 **Mengakses teknologi canggih** melalui interface yang user-friendly
- 💰 **Mengurangi kerugian** akibat keterlambatan penanganan penyakit
- 🌱 **Meningkatkan produktivitas** pertanian jagung secara berkelanjutan

---

## 🏗️ **Arsitektur Sistem**

### **Frontend**
- **Framework**: React.js
- **User Interface**: Modern, responsive, dan intuitif
- **Fitur**: Upload gambar, preview real-time, hasil diagnosis instan

### **Backend**
- **API Integration**: RESTful services untuk komunikasi dengan model ML
- **Image Processing**: Preprocessing dan handling untuk input gambar
- **Response Management**: Structured output dengan confidence score

### **Machine Learning Model**
- **Architecture**: Convolutional Neural Network (CNN)
- **Transfer Learning**: DenseNet121 pre-trained model
- **Optimization**: Fine-tuning untuk dataset khusus penyakit jagung
- **Performance**: High accuracy dengan inference time yang optimal

---

## 📊 **Pengumpulan Data**

Dataset pada penelitian ini diperoleh melalui **survei langsung** dan **observasi komprehensif** di ladang jagung masyarakat Indonesia, menghasilkan koleksi data yang representatif dan berkualitas tinggi:

### 📈 **Statistik Dataset**
- 🖼️ **5,368 gambar** berkualitas tinggi daun jagung
- 🎥 **10 video** dokumentasi kondisi tanaman di lapangan
- 📍 **Multi-lokasi** pengambilan data untuk variasi kondisi

### 🏷️ **Klasifikasi Penyakit**
Data diklasifikasikan secara teliti ke dalam **4 kategori utama**:

| Kategori | Deskripsi | Karakteristik |
|----------|-----------|---------------|
| 🍂 **Hawar Daun** (*Blight*) | Penyakit yang menyebabkan layu dan kematian jaringan daun | Bercak coklat keabu-abuan, tepi tidak beraturan |
| 🍃 **Bercak Daun** (*Leaf Spot*) | Infeksi yang membentuk bercak-bercak pada permukaan daun | Bercak bulat dengan halo kuning |
| 🌾 **Karat** (*Rust*) | Penyakit jamur yang menyebabkan pustula berwarna oranye-kecoklatan | Serbuk oranye pada kedua sisi daun |
| 🌿 **Sehat** (*Healthy*) | Kondisi daun jagung yang normal dan sehat | Warna hijau segar, tidak ada bercak atau kerusakan |

---

## 🚀 **Fitur Unggulan**

### ✨ **Teknologi Canggih**
- **Deep Learning**: Implementasi CNN dengan arsitektur DenseNet121
- **Transfer Learning**: Memanfaatkan pre-trained model untuk performa optimal
- **Real-time Processing**: Diagnosis instan dengan waktu respons minimal
- **High Accuracy**: Tingkat akurasi tinggi berkat dataset yang komprehensif

### 🎨 **User Experience**
- **Drag & Drop**: Upload gambar dengan mudah
- **Preview Mode**: Visualisasi gambar sebelum diagnosis
- **Confidence Score**: Tingkat kepercayaan hasil diagnosis
- **Responsive Design**: Kompatibel dengan berbagai perangkat

### 📱 **Aksesibilitas**
- **Web-based**: Dapat diakses melalui browser
- **Mobile Friendly**: Optimized untuk penggunaan di smartphone
- **Offline Capability**: Dapat bekerja dengan koneksi internet terbatas

---

## 🛠️ **Instalasi dan Setup**

### **Prerequisites**
```bash
Node.js >= 14.0.0
npm >= 6.0.0
Python >= 3.8
TensorFlow >= 2.0
```

### **Frontend Setup**
```bash
# Clone repository
git clone https://github.com/yourusername/jagung-sehat.git
cd jagung-sehat/frontend

# Install dependencies
npm install

# Start development server
npm start
```

### **Backend Setup**
```bash
# Navigate to backend directory
cd ../backend

# Install Python dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

---

## 🔬 **Metodologi Machine Learning**

### **Data Preprocessing**
- **Image Augmentation**: Rotasi, flip, zoom, brightness adjustment
- **Normalization**: Standarisasi pixel values untuk konsistensi
- **Resizing**: Uniform image dimensions untuk input model

### **Model Architecture**
- **Base Model**: DenseNet121 pre-trained pada ImageNet
- **Custom Layers**: Dense layers untuk klasifikasi 4 kelas
- **Activation**: Softmax untuk output probabilitas
- **Optimizer**: Adam dengan learning rate scheduling

### **Training Process**
- **Data Split**: 80% training, 10% validation, 10% testing
- **Epochs**: Optimal training dengan early stopping
- **Batch Size**: Optimized untuk GPU memory efficiency
- **Regularization**: Dropout dan L2 regularization

---

## 📈 **Performa Model**

| Metrik | Nilai |
|--------|-------|
| **Accuracy** | 94.2% |
| **Precision** | 93.8% |
| **Recall** | 94.1% |
| **F1-Score** | 93.9% |

### **Confusion Matrix**
Model menunjukkan performa yang sangat baik dalam membedakan keempat kelas penyakit dengan minimal false positive dan false negative.

---

## 🎯 **Dampak dan Manfaat**

### **Bagi Petani**
- **Deteksi Dini**: Identifikasi penyakit sebelum menyebar luas
- **Penghematan Biaya**: Mengurangi penggunaan pestisida yang tidak perlu
- **Peningkatan Yield**: Panen yang lebih optimal melalui penanganan tepat waktu

### **Bagi Industri Pertanian**
- **Digitalisasi**: Mendorong adopsi teknologi di sektor pertanian
- **Sustainability**: Praktik pertanian yang lebih berkelanjutan
- **Knowledge Transfer**: Penyebaran pengetahuan melalui platform digital

---

## 🤝 **Kontribusi**

Kami mengundang kontribusi dari komunitas untuk mengembangkan **Jagung Sehat** menjadi lebih baik:

1. **Fork** repository ini
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

---

## 📝 **Lisensi**

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

## 👥 **Tim Pengembang**

### 🚀 **Machine Learning Engineers**
- **Sion Pardosi** - ML Specialist | 🔗 [GitHub](https://github.com/sionpardosi/)
- **Luigi** - ML Specialist | 📧 luigiifandwitomo@gmail.com
- **Irene** - ML Specialist | 🔗 [GitHub](https://github.com/irene464117)

### 💻 **Full-Stack Developers**
- **Alif Firman** - Frontend & Backend Developer | 🔗 [GitHub](https://github.com/aliffirmansh)
- **Azel** - Frontend & Backend Developer | 🔗 [GitHub](https://github.com/azaliafd)
- **Rafi** - Frontend & Backend Developer | 🔗 [GitHub](https://github.com/Apchier)

### 🎯 **Project Leadership**
- **Tim Kolaboratif** - Pengembangan bersama dengan pendekatan agile dan iteratif

---

## 📞 **Kontak**

- **Email**: 📧 Coming Soon
- **LinkedIn**: 💼 Coming Soon  
- **Website**: 🌐 Coming Soon
- **GitHub Organization**: 🔗 [Jagung Sehat Repository](https://github.com/jagung-sehat)

---

## 🙏 **Acknowledgments**

- Petani jagung Indonesia yang telah berpartisipasi dalam pengumpulan data
- Komunitas open source yang menyediakan tools dan libraries
- Tim peneliti yang berkontribusi dalam pengembangan metodologi

---

<div align="center">

**🌽 Jagung Sehat - Teknologi untuk Pertanian Indonesia yang Lebih Baik 🌽**

Made with ❤️ by Indonesian Developers

</div>