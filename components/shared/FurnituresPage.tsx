"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { getAllFurnitures } from "@/lib/actions/furniture.action";
import { useStateContext } from "@/components/context/CartContext";

const categories = ["All", "Wedding", "Birthday", "Corporate"];
const furnitureTypes = [
  "All",
  "Table",
  "Chair",
  "Tablecloth",
  "Decoration",
  "Seating",
];

export default function FurnituresPage() {
  const [furnitures, setFurnitures] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilters, setTypeFilters] = useState(["All"]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { cartItems, onAdd, toggleCartItemQuanitity } = useStateContext();

  const fetchFurnitures = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        query: nameFilter,
        limit: 12,
        page: currentPage,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
        type: typeFilters.includes("All") ? undefined : typeFilters,
      };
      const { data, totalPages } = await getAllFurnitures(queryParams);
      setFurnitures(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching furnitures:", error);
    } finally {
      setLoading(false);
    }
  }, [nameFilter, categoryFilter, typeFilters, currentPage]);

  useEffect(() => {
    fetchFurnitures();
  }, [fetchFurnitures]);

  const toggleTypeFilter = (type) => {
    setTypeFilters((prev) => {
      if (type === "All") return ["All"];
      const filtered = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      return filtered.length ? filtered : ["All"];
    });
    setCurrentPage(1);
  };

  const handleInputChange = (item, value) => {
    const quantity = parseInt(value, 10) || 0;
    if (quantity > 0) {
      onAdd(
        item,
        quantity - (cartItems.find((i) => i._id === item._id)?.quantity || 0)
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFurnitures();
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-grow">
              <Label htmlFor="name-filter">Filter by name</Label>
              <Input
                id="name-filter"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Search furniture..."
              />
            </div>
            <div className="w-full sm:w-64">
              <Label htmlFor="category-filter">Filter by category</Label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setCurrentPage(1);
                  fetchFurnitures();
                }}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="self-end">
              Search
            </Button>
          </form>
          <div>
            <Label>Filter by furniture type</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {furnitureTypes.map((type) => (
                <Badge
                  key={type}
                  variant={typeFilters.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    toggleTypeFilter(type);
                    fetchFurnitures();
                  }}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {furnitures.map((item) => {
              const cartItem = cartItems?.find(
                (cartItem) => cartItem._id === item._id
              );

              return (
                <Card key={item._id} className="flex flex-col">
                  <CardHeader className="p-0">
                    <CldImage
                      width="500"
                      height="500"
                      src={item.imageUrl}
                      alt={item.name}
                      crop={{ type: "auto", source: true }}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="flex-grow p-4">
                    <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.category} - {item.type}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-gray-700">
                        ${item.price}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, "dec", item)
                          }
                          aria-label={`Decrease quantity of ${item.name}`}
                          disabled={!cartItem}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="0"
                          value={cartItem?.quantity || ""}
                          onChange={(e) =>
                            handleInputChange(item, e.target.value)
                          }
                          className="w-16 text-center"
                          aria-label={`Quantity of ${item.name}`}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, "inc", item)
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={!cartItem}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4">
                    <Button onClick={() => onAdd(item, 1)} className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => prev - 1);
              fetchFurnitures();
            }}
          >
            Previous
          </Button>
          <span className="px-4">{currentPage}</span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              fetchFurnitures();
            }}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
