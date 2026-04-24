import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    setListing(data);
  };

  if (!listing) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div dir="rtl" className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{listing.title}</h1>

      <p className="text-gray-600 mt-2">
        {listing.city} - {listing.category}
      </p>

      <p className="mt-6">{listing.description}</p>

      <p className="text-2xl font-bold mt-6">${listing.price}</p>
    </div>
  );
}
