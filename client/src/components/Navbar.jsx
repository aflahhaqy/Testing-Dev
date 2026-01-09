import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-blue-600">Aplikasi ISM</h1>
          <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors">
            Beranda
          </Link>
        </div>
        <div className="space-x-3">
          <Link
            to="/add-application"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors"
          >
            Tambah Aplikasi
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-5 py-2 rounded-lg transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>
    </nav>
  );
}
