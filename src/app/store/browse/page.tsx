"use client";
import { useEffect, useState } from "react";
import StoreHeader from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import MerchCard from "@/components/store/subcomponents/MerchCard";

interface MerchItem {
  id: number;
  imgUri: string;
  name: string;
  price: number;
  available: boolean;
  quantity: number;
  isFeatured: boolean;
  category: string;
  description?: string;
}

export default function BrowsePage() {
  const [allItems, setAllItems] = useState<MerchItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("name");

  const categories = ["All", "Electronics", "Clothing", "Accessories"];

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/get-merch");

        if (!response.ok) {
          throw new Error("Failed to fetch merchandise");
        }

        const fullData = await response.json();
        const data = fullData.responseData;
        console.log("API Response:", data);
        console.log("Is array:", Array.isArray(data));
        console.log("Data length:", data?.length);
        console.log("First item:", data?.[0]);

        // Transform the incomplete data into complete product objects
        const merchArray = Array.isArray(data)
          ? data.map((item, index) => {
              const transformedItem = {
                id: item.id || index + 1,
                name: item.name || `Product ${index + 1}`,
                price: item.price || Math.random() * 100 + 10,
                category: item.category,
                imgUri:
                  item.imgUri ||
                  `/images/placeholder-${item.category?.toLowerCase()}.jpg`,
                available: item.available !== false,
                quantity: item.quantity || Math.floor(Math.random() * 50) + 1,
                isFeatured: item.isFeatured || Math.random() > 0.7,
                description: item.description || `${item.category} product`,
              };
              console.log(`Transformed item ${index}:`, transformedItem);
              return transformedItem;
            })
          : [];

        console.log("Final merchArray:", merchArray);
        console.log("MerchArray length:", merchArray.length);

        setAllItems(merchArray);
        setFilteredItems(merchArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        // Set empty arrays on error to prevent map errors
        setAllItems([]);
        setFilteredItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMerch();
  }, []);

  useEffect(() => {
    // Ensure allItems is an array before filtering
    if (!Array.isArray(allItems)) {
      setFilteredItems([]);
      return;
    }

    let filtered =
      selectedCategory === "All"
        ? allItems
        : allItems.filter((item) => item.category === selectedCategory);

    // Sort items
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [allItems, selectedCategory, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-black mb-12">
              Browse Products
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-black mb-4">
                Browse Products
              </h1>
              <p className="text-red-600">Error loading products: {error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-black mb-12">
            Browse Products
          </h1>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors trackable ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                  id={`filter-${category.toLowerCase()}`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-black bg-white trackable"
              id="sort-dropdown"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredItems.length} of {allItems.length} products
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Products Grid */}
          {Array.isArray(filteredItems) && filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          ) : Array.isArray(filteredItems) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="trackable"
                  id={`product-${item.id}`}
                >
                  <MerchCard
                    merch={{
                      id: item.id.toString(),
                      name: item.name,
                      description: item.description || `${item.category} item`,
                      price: item.price,
                      imageUrl: item.imgUri,
                      inStock: item.available,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-red-600">
                Error: Invalid data format received
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
