import { useState } from "react";
import { MapPin, Mail, Phone, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-secondary">Hubungi Kami</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Jika kamu memiliki pertanyaan atau masukan terkait aplikasi ini, silakan hubungi kami melalui formulir atau kontak berikut.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-green-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-green-700">Informasi Kontak</h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-green-600" />
                <span>Jl. Jagung Sehat No. 123, Bandung</span>
              </div>

              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-green-600" />
                <span>kontak@deteksijagung.com</span>
              </div>

              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-green-600" />
                <span>+62 812-3456-7890</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4 text-green-700">Jam Operasional</h4>
              <p>Senin - Jumat: 09.00 - 17.00</p>
              <p>Sabtu: 10.00 - 14.00</p>
              <p>Minggu & Hari Libur: Tutup</p>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-gray-700">
                  Alamat Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="contoh@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-gray-700">
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tulis pesan Anda di sini"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
              >
                <Send className="mr-2 w-5 h-5" />
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;