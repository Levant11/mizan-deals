import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Lock, TrendingUp, DollarSign, Send } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showUnlock, setShowUnlock] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  const mockAssets = [
    {
      id: 1,
      title: "مطعم راقي - الكرادة",
      city: "بغداد",
      price: "$120,000",
      score: 82,
    },
    {
      id: 2,
      title: "مصنع مواد غذائية",
      city: "أربيل",
      price: "$450,000",
      score: 74,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">

        <h1 className="text-3xl font-bold mb-2">لوحة المستثمر</h1>
        <p className="text-slate-500 mb-10">أهلاً {user?.email}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {mockAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white p-6 rounded-2xl shadow border border-slate-200"
            >
              <h3 className="font-bold text-lg">{asset.title}</h3>
              <p className="text-slate-500 text-sm mt-1">
                {asset.city}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold">{asset.price}</span>
                <span className="text-sm text-emerald-600 font-semibold">
                  AI Score {asset.score}
                </span>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowUnlock(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800"
                >
                  <Lock size={16} />
                  Unlock Intelligence
                </button>

                <button
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowOffer(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 border border-slate-300 py-2 rounded-lg hover:bg-slate-100"
                >
                  <Send size={16} />
                  تقديم عرض
                </button>
              </div>
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

      {showOffer && (
        <OfferModal
          asset={selectedAsset}
          onClose={() => setShowOffer(false)}
        />
      )}
    </div>
  );
}

function UnlockModal({ asset, onClose }: any) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          Unlock Asset Intelligence
        </h2>

        {!unlocked ? (
          <>
            <p className="text-slate-600 mb-6">
              للحصول على البيانات الكاملة للأصل:
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
              <p>العنوان الكامل: الكرادة - بغداد</p>
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

function OfferModal({ asset, onClose }: any) {
  const [price, setPrice] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          تقديم عرض على {asset.title}
        </h2>

        <input
          placeholder="السعر المقترح"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button
          onClick={() => {
            alert("تم إرسال العرض (محاكاة)");
            onClose();
          }}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700"
        >
          إرسال العرض
        </button>

        <button
          onClick={onClose}
          className="mt-4 w-full border border-slate-300 py-2 rounded-lg"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}
