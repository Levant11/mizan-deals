import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function Browse() {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    setListings(data || []);
  };

  return (
    <div dir="rtl" className="p-8">
      <h1 className="text-3xl font-bold mb-6">تصفح الإعلانات</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <Link
            key={item.id}
            to={`/listings/${item.id}`}
            className="border p-4 rounded shadow hover:shadow-lg"
          >
            <h2 className="font-bold">{item.title}</h2>
            <p className="text-sm text-gray-500">
              {item.city} - {item.category}
            </p>
            <p className="text-lg font-semibold mt-2">${item.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
