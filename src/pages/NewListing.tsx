import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function NewListing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    if (!title || !description || !price || !city || !category) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const { error } = await supabase.from("listings").insert({
      seller_id: user?.id,
      title,
      description,
      price: Number(price),
      city,
      category,
    });

    if (error) {
      toast.error("فشل إنشاء الإعلان");
      return;
    }

    toast.success("تم إنشاء الإعلان بنجاح");
    navigate("/my-listings");
  };

  return (
    <div dir="rtl" className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">إنشاء إعلان</h1>

      <div className="space-y-4">
        <input
          className="w-full border p-3 rounded"
          placeholder="العنوان"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded"
          placeholder="الوصف"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-3 rounded"
          placeholder="السعر بالدولار"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="المدينة"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="الفئة (مطعم، مصنع...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          نشر الإعلان
        </button>
      </div>
    </div>
  );
}
