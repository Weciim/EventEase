"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllPacks } from "@/lib/actions/pack.actions";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

export default function PackPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [packs, setPacks] = useState([]);
  const [filteredPacks, setFilteredPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPacks = async () => {
    setLoading(true);
    try {
      const queryParams = {
        limit: 8,
        page: 1,
      };
      const { data } = await getAllPacks(queryParams);
      setPacks(data);
      setFilteredPacks(data);
    } catch (error) {
      console.error("Error fetching event packs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  useEffect(() => {
    const filtered = packs.filter((pack) =>
      pack.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPacks(filtered);
  }, [searchTerm, packs]);

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12">
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Choose Your Perfect Event Package
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we have the perfect
            package to make your event truly special.
          </p>
        </section>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for an event package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPacks.map((pack, index) => (
              <motion.div
                key={pack._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Card
                  className={`h-full ${
                    hoveredIndex === index ? "shadow-lg" : "shadow"
                  } transition-shadow duration-300`}
                >
                  <CardHeader className="bg-gray-100 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold">
                        {pack.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {pack.imageUrl && (
                      <CldImage
                        src={pack.imageUrl}
                        alt={pack.name}
                        width="500"
                        height="500"
                        crop={{
                          type: "auto",
                          source: true,
                        }}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <CardDescription className="text-base mb-2">
                      {pack.description || "No description available."}
                    </CardDescription>
                    {pack.price && (
                      <p className="text-lg font-semibold text-blue-500">
                        ${pack.price.toFixed(2)}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href={`/packs/${pack._id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
