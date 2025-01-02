"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  ShoppingCart,
  ArrowLeft,
  // PackageMinus,
} from "lucide-react";
import { getPackById } from "@/lib/actions/pack.actions";
import { IPack } from "@/lib/database/models/pack.model";
import { useStateContext } from "@/components/context/CartContext";

export default function PackDetails() {
  const { id } = useParams();
  const [packData, setPackData] = useState<IPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { onAdd } = useStateContext();

  useEffect(() => {
    const fetchPackDetails = async () => {
      try {
        if (!id) throw new Error("Pack ID is missing");

        const data = await getPackById(id);
        setPackData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch pack details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPackDetails();
  }, [id]);

  const addFurnitures = (excludedId: string) => {
    if (!packData?.furnitures) return;

    const itemsToAdd = packData.furnitures.filter(
      (item) => item._id !== excludedId
    );
    itemsToAdd.forEach((item) => {
      onAdd(item, 1);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800">{packData?.name}</h1>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-600">{"4.2" || "N/A"}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-1" />
              {"Tunis" || "Location not available"}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Included Furniture</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packData?.furnitures?.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <CardHeader className="p-0">
                <CldImage
                  width="500"
                  height="500"
                  src={item.imageUrl}
                  alt={item.name}
                  crop={{
                    type: "auto",
                    source: true,
                  }}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  {/* <span
                    onClick={() => addFurnitures(item._id)}
                    className="cursor-pointer"
                  >
                    <PackageMinus color="#db3333" />
                  </span> */}
                </div>
                <CardDescription>
                  Quantity: {item.availableQuantity || "N/A"}
                  <br />
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">${packData?.price}</p>
            <p className="text-sm text-gray-600">{packData?.description}</p>
          </div>
          <div>
            <Button onClick={() => onAdd(packData, 1)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
