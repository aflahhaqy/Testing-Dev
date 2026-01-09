import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../config/axios";
import Swal from "sweetalert2";

export default function Home() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get("/applications");
      setApplications(data.applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.no_aplikasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.tempat_lahir.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      if (statusFilter === "no-score") {
        filtered = filtered.filter((app) => !app.ApplicationScore);
      } else {
        filtered = filtered.filter(
          (app) =>
            app.ApplicationScore &&
            app.ApplicationScore.status === statusFilter
        );
      }
    }

    setFilteredApplications(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatistics = () => {
    if (!applications || !Array.isArray(applications)) {
      return { total: 0, noScore: 0, lowRisk: 0, mediumRisk: 0, highRisk: 0 };
    }
    
    const total = applications.length;
    const noScore = applications.filter((app) => !app.ApplicationScore).length;
    const lowRisk = applications.filter(
      (app) => app.ApplicationScore?.status === "LOW RISK"
    ).length;
    const mediumRisk = applications.filter(
      (app) => app.ApplicationScore?.status === "MEDIUM RISK"
    ).length;
    const highRisk = applications.filter(
      (app) => app.ApplicationScore?.status === "HIGH RISK"
    ).length;

    return { total, noScore, lowRisk, mediumRisk, highRisk };
  };

  const stats = getStatistics();

  const getStatusBadge = (application) => {
    if (!application.ApplicationScore) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
          No Score
        </span>
      );
    }

    const status = application.ApplicationScore.status;
    let bgColor = "";
    if (status === "LOW RISK") bgColor = "bg-green-200 text-green-800";
    else if (status === "MEDIUM RISK") bgColor = "bg-orange-200 text-orange-800";
    else if (status === "HIGH RISK") bgColor = "bg-red-200 text-red-800";

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bgColor}`}>
        {status}
      </span>
    );
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/applications/${id}`);
          Swal.fire("Deleted!", "Application has been deleted.", "success");
          fetchApplications();
        } catch (error) {
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Failed to delete application",
            "error"
          );
        }
      }
    });
  };

  const handleDetail = (application) => {
    Swal.fire({
      title: "Application Detail",
      html: `
        <div class="text-left">
          <p><strong>No Aplikasi:</strong> ${application.no_aplikasi}</p>
          <p><strong>Nama:</strong> ${application.nama}</p>
          <p><strong>Tanggal Lahir:</strong> ${formatDate(application.tanggal_lahir)}</p>
          <p><strong>Tempat Lahir:</strong> ${application.tempat_lahir}</p>
          <p><strong>Jenis Kelamin:</strong> ${application.jenis_kelamin}</p>
          <p><strong>Alamat:</strong> ${application.alamat}</p>
          <p><strong>Kode Pos:</strong> ${application.kode_pos}</p>
          ${
            application.ApplicationScore
              ? `
            <hr class="my-2" />
            <p><strong>Total Score:</strong> ${application.ApplicationScore.total_score}</p>
            <p><strong>Status:</strong> ${application.ApplicationScore.status}</p>
          `
              : ""
          }
        </div>
      `,
      width: 600,
      confirmButtonText: "Close",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Aplikasi Penilaian Risiko</h1>

        {/* Two Column Layout */}
        <div className="flex gap-6">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Cari aplikasi, nama, atau tempat lahir..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Urutkan</option>
                <option value="no-score">Belum Dinilai</option>
                <option value="LOW RISK">Risiko Rendah</option>
                <option value="MEDIUM RISK">Risiko Sedang</option>
                <option value="HIGH RISK">Risiko Tinggi</option>
              </select>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      No
                    </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                No Aplikasi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tempat Lahir
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tanggal Lahir
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Jenis Kelamin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredApplications && filteredApplications.map((application, index) => (
                  <tr key={application.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{application.no_aplikasi}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{application.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{application.tempat_lahir}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{formatDate(application.tanggal_lahir)}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{application.jenis_kelamin}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {application.ApplicationScore?.total_score || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {getStatusBadge(application)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDetail(application)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => navigate(`/scoring/${application.id}`)}
                        className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                          application.ApplicationScore
                            ? "bg-purple-50 text-purple-600 hover:bg-purple-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {application.ApplicationScore ? "Ubah Nilai" : "Nilai"}
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/update-application/${application.id}`)
                        }
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => handleDelete(application.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!filteredApplications || filteredApplications.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada aplikasi ditemukan
          </div>
          )}
        </div>
          </div>

          {/* Right Column - Statistics Sidebar */}
          <div className="w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase">Ringkasan Aplikasi</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Total Aplikasi</span>
                  <span className="text-3xl font-bold text-gray-800">{stats.total}</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Belum Dinilai</span>
                  <span className="text-3xl font-bold text-gray-800">{stats.noScore}</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Risiko Rendah</span>
                  <span className="text-3xl font-bold text-green-600">{stats.lowRisk}</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Risiko Sedang</span>
                  <span className="text-3xl font-bold text-orange-600">{stats.mediumRisk}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Risiko Tinggi</span>
                  <span className="text-3xl font-bold text-red-600">{stats.highRisk}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
