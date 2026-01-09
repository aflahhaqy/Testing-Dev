import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../config/axios";
import Swal from "sweetalert2";

export default function AddAplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    no_aplikasi: "",
    nama: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    kode_pos: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/applications", formData);
      Swal.fire({
        icon: "success",
        title: "Application Added",
        text: "Application has been successfully added",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Add Application",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tambah Aplikasi Baru</h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                No Aplikasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                value={formData.no_aplikasi}
                onChange={(e) =>
                  setFormData({ ...formData, no_aplikasi: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                value={formData.tanggal_lahir}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal_lahir: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                value={formData.tempat_lahir}
                onChange={(e) =>
                  setFormData({ ...formData, tempat_lahir: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                value={formData.jenis_kelamin}
                onChange={(e) =>
                  setFormData({ ...formData, jenis_kelamin: e.target.value })
                }
                required
              >
                <option value="">Select Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Kode Pos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                value={formData.kode_pos}
                onChange={(e) =>
                  setFormData({ ...formData, kode_pos: e.target.value })
                }
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2 font-medium">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                rows="3"
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
                required
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
            >
              Kirim
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
