import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "../config/axios";
import Swal from "sweetalert2";

export default function ScoringForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [existingScore, setExistingScore] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [appRes, groupsRes, scoreRes] = await Promise.all([
        axios.get(`/applications/${id}`),
        axios.get("/groups-items"),
        axios.get(`/applications/${id}/score`).catch(() => ({ data: null })),
      ]);

      setApplication(appRes.data.application);
      setGroups(groupsRes.data.groups);
      
      if (scoreRes.data && scoreRes.data.score) {
        setExistingScore(scoreRes.data.score);
        // Pre-select items if there's an existing score
        const preSelected = {};
        scoreRes.data.score.ApplicationAnswers.forEach((answer) => {
          preSelected[answer.itemId] = true;
        });
        setSelectedItems(preSelected);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Data",
        text: error.response?.data?.message || "Something went wrong",
      });
      navigate("/");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const groupItemsByCategory = (items) => {
    const categories = {};
    items.forEach((item) => {
      const category = item.nama_item.split(" - ")[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    return categories;
  };

  const calculateScores = () => {
    if (!groups || !Array.isArray(groups)) {
      return { totalScore: 0, groupScores: {}, status: "HIGH RISK" };
    }
    
    let totalScore = 0;
    const groupScores = {};

    groups.forEach((group) => {
      let groupScore = 0;
      if (group.Items && Array.isArray(group.Items)) {
        group.Items.forEach((item) => {
          if (selectedItems[item.id]) {
            const itemScore = item.bobot_f * item.bobot_d;
            groupScore += itemScore;
          }
        });
      }
      const weightedScore = groupScore * group.bobot_b;
      groupScores[group.id] = {
        raw: groupScore,
        weighted: weightedScore,
      };
      totalScore += weightedScore;
    });

    let status = "";
    if (totalScore <= 55) status = "HIGH RISK";
    else if (totalScore <= 70) status = "MEDIUM RISK";
    else status = "LOW RISK";

    return { totalScore, groupScores, status };
  };

  const handleItemSelect = (itemId, groupId) => {
    const group = groups.find((g) => g.id === groupId);
    const item = group.Items.find((i) => i.id === itemId);
    const category = item.nama_item.split(" - ")[0];

    // Unselect all items in the same category
    const newSelected = { ...selectedItems };
    group.Items.forEach((i) => {
      if (i.nama_item.startsWith(category + " - ")) {
        delete newSelected[i.id];
      }
    });

    // Select the new item
    newSelected[itemId] = true;
    setSelectedItems(newSelected);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const itemIds = Object.keys(selectedItems)
      .filter((key) => selectedItems[key])
      .map(Number);

    if (itemIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Items Selected",
        text: "Please select at least one item",
      });
      return;
    }

    try {
      await axios.post(`/applications/${id}/scoring`, { itemIds });
      Swal.fire({
        icon: "success",
        title: "Score Submitted",
        text: "Scoring has been successfully submitted",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Submit Score",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Memuat...</div>
      </div>
    );
  }

  const scores = calculateScores();
  const selectedCount = Object.values(selectedItems).filter((v) => v).length;
  const totalSteps = groups.length + 1; // +1 for review step
  const currentGroup = currentStep < groups.length ? groups[currentStep] : null;
  const isReviewStep = currentStep === groups.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!application) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Memuat data aplikasi...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Formulir Penilaian Risiko</h1>

        {/* Application Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-800 font-medium">No Aplikasi</p>
            <p className="font-semibold text-gray-900">{application.no_aplikasi}</p>
          </div>
          <div>
            <p className="text-sm text-gray-800 font-medium">Nama</p>
            <p className="font-semibold text-gray-900">{application.nama}</p>
          </div>
          <div>
            <p className="text-sm text-gray-800 font-medium">Tanggal Lahir</p>
            <p className="font-semibold text-gray-900">{formatDate(application.tanggal_lahir)}</p>
          </div>
        </div>
          {existingScore && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-800 font-medium">Current Score</p>
            <p className="font-semibold text-gray-900">
              {existingScore.total_score.toFixed(2)} - {existingScore.status}
            </p>
          </div>
        )}
      </div>

        {/* Scoring Summary */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Ringkasan Penilaian</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-800 font-medium">Kategori Dipilih</p>
            <p className="text-2xl font-bold text-blue-600">{selectedCount}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-800 font-medium">Total Nilai</p>
            <p className="text-2xl font-bold text-green-600">
              {scores.totalScore.toFixed(2)}
            </p>
          </div>
          <div
            className={`p-4 rounded ${
              scores.status === "LOW RISK"
                ? "bg-green-100"
                : scores.status === "MEDIUM RISK"
                ? "bg-orange-100"
                : "bg-red-100"
            }`}
          >
            <p className="text-sm text-gray-800 font-medium">Tingkat Risiko</p>
            <p
              className={`text-2xl font-bold ${
                scores.status === "LOW RISK"
                  ? "text-green-700"
                  : scores.status === "MEDIUM RISK"
                  ? "text-orange-700"
                  : "text-red-700"
              }`}
            >
              {scores.status}
            </p>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mt-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-gray-800">
                  Progres Nilai
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${Math.min((scores.totalScore / 100) * 100, 100)}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  scores.status === "LOW RISK"
                    ? "bg-green-500"
                    : scores.status === "MEDIUM RISK"
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-800 font-medium">
              <span>0</span>
              <span>55 (Tinggi)</span>
              <span>70 (Sedang)</span>
              <span>100 (Rendah)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Form */}
      <form onSubmit={handleSubmit}>
        {/* Wizard Steps Indicator */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-center mb-8">
            {groups.map((group, index) => (
              <div key={group.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      index === currentStep
                        ? "bg-blue-600 text-white"
                        : index < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 text-center max-w-[80px]">
                    {group.nama_group}
                  </span>
                </div>
                {/* Connector Line */}
                {index < groups.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-colors ${
                      index < currentStep ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
            {/* Review Step */}
            <div className="flex items-center">
              <div
                className={`w-12 h-1 mx-2 transition-colors ${
                  currentStep >= groups.length ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    isReviewStep
                      ? "bg-blue-600 text-white"
                      : currentStep > groups.length
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  ✓
                </div>
                <span className="text-xs mt-2 text-gray-600 text-center max-w-[80px]">
                  Tinjau
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        {!isReviewStep && currentGroup && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{currentGroup.nama_group}</h2>
              <span className="text-sm text-gray-500">
                Langkah {currentStep + 1} dari {totalSteps}
              </span>
            </div>

            {Object.entries(groupItemsByCategory(currentGroup.Items)).map(([category, items]) => {
              const selectedItemInCategory = items.find(item => selectedItems[item.id]);
              return (
                <div key={category} className="mb-6">
                  <label className="block text-lg font-semibold mb-3 text-gray-900">
                    {category}
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    value={selectedItemInCategory?.id || ""}
                    onChange={(e) => {
                      const itemId = parseInt(e.target.value);
                      if (itemId) {
                        handleItemSelect(itemId, currentGroup.id);
                      }
                    }}
                  >
                    <option value="">Pilih opsi</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama_item}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}

            {scores.groupScores[currentGroup.id] && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-800 font-medium">Nilai Grup:</span>
                  <span className="font-semibold text-gray-800">
                    {scores.groupScores[currentGroup.id].raw.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-800 font-medium">Nilai Tertimbang:</span>
                  <span className="font-semibold text-gray-800">
                    {scores.groupScores[currentGroup.id].weighted.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Review Step Content */}
        {isReviewStep && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tinjau Pilihan Anda</h2>
              <p className="text-gray-600">Silakan tinjau pilihan Anda sebelum mengirim</p>
            </div>

            {groups.map((group) => {
              const selectedItemsInGroup = group.Items.filter(item => selectedItems[item.id]);
              if (selectedItemsInGroup.length === 0) return null;

              const categories = groupItemsByCategory(group.Items);
              
              return (
                <div key={group.id} className="mb-6 pb-6 border-b last:border-b-0">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{group.nama_group}</h3>
                  
                  {Object.entries(categories).map(([category, items]) => {
                    const selectedItem = items.find(item => selectedItems[item.id]);
                    if (!selectedItem) return null;
                    
                    return (
                      <div key={category} className="mb-3 pl-4">
                        <p className="text-sm font-semibold text-gray-700">{category}</p>
                        <p className="text-gray-900 mt-1">{selectedItem.nama_item}</p>
                      </div>
                    );
                  })}

                  {scores.groupScores[group.id] && (
                    <div className="mt-4 pl-4 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Nilai Grup:</span>
                          <span className="ml-2 font-semibold text-gray-800">
                            {scores.groupScores[group.id].raw.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Nilai Tertimbang:</span>
                          <span className="ml-2 font-semibold text-gray-800">
                            {scores.groupScores[group.id].weighted.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Final Score Summary */}
            <div className="mt-6 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Item Dipilih</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Nilai</p>
                  <p className="text-2xl font-bold text-green-600">{scores.totalScore.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Tingkat Risiko</p>
                  <p className={`text-2xl font-bold ${
                    scores.status === "LOW RISK"
                      ? "text-green-600"
                      : scores.status === "MEDIUM RISK"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}>
                    {scores.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-8 py-3 rounded-xl font-semibold transition-colors ${
            currentStep === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Sebelumnya
        </button>

        {currentStep < groups.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors"
          >
            Langkah Berikutnya
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition-colors"
          >
            {existingScore ? "Perbarui Nilai" : "Kirim Nilai"}
          </button>
        )}
      </div>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="w-full px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
      >
        Batal
      </button>
      </div>
    </div>
  );
}
