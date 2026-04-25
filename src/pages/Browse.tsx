import { useState } from "react";
import { Search, Filter, Lock, MapPin } from "lucide-react";

export default function Browse() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showUnlock, setShowUnlock] = useState(false);

  const mockAssets = [
    {
      id: 1,
      title: "مطعم فاخر - الكرادة",
      city: "بغداد",
      category: "مطاعم",
      price: "$120,000",
      score: 85,
      risk: "منخفض",
    },
    {
      id: 2,
      title: "مصنع مواد غذائية",
      city: "أربيل",
      category: "صناعات",
      price: "$450,000",
      score: 74,
      risk: "متوسط",
    },
    {
      id: 3,
      title: "مجمع مكاتب تجارية",
      city: "السليمانية",
      category: "عقارات",
      price: "$800,000",
      score: 68,
      risk: "متوسط",
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Marketplace</h1>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg">
              <Search size={16} />
              <input
                placeholder="ابحث عن أصل..."
                className="outline-none"
              />
            </div>

            <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-slate-100">
              <Filter size={16} />
              تصفية
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {mockAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{asset.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    asset.score > 80
                      ? "bg-emerald-100 text-emerald-700"
                      : asset.score > 70
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  AI {asset.score}
                </span>
              </div>

              <div className="mt-3 text-sm text-slate-500 flex items-center gap-2">
                <MapPin size={14} />
                {asset.city}
              </div>

              <div className="mt-4">
                <p className="text-xl font-bold">{asset.price}</p>
                <p className="text-sm text-slate-500">
                  مستوى المخاطرة: {asset.risk}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedAsset(asset);
                  setShowUnlock(true);
                }}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800"
              >
                <Lock size={16} />
                Unlock Intelligence
              </button>
            </div>
          ))}
        </div>
      </div>

      {showUnlock && (
        <UnlockModal
          asset={selectedAsset}
          onClose={() => setShowUnlock(false)}
        />
      )}
    </div>
  );
}

function UnlockModal({ asset, onClose }: any) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[420px]">
        <h2 className="text-xl font-bold mb-4">
          Unlock Asset Intelligence
        </h2>

        {!unlocked ? (
          <>
            <p className="text-slate-600 mb-6">
              للحصول على تفاصيل الأصل الكاملة:
            </p>

            <button
              onClick={() => setUnlocked(true)}
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800"
            >
              دفع 25$ (محاكاة)
            </button>
          </>
        ) : (
          <>
            <div className="bg-slate-100 p-4 rounded-lg mb-4">
              <p>المالك: أحمد الكرخي</p>
              <p>الهاتف: +9647701234567</p>
              <p>العنوان الكامل: {asset.city}</p>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full border border-slate-300 py-2 rounded-lg"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
