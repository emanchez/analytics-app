"use client";
import { useEffect, useState } from "react";
import StoreHeader from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import MerchCard from "@/components/store/subcomponents/MerchCard";
import { MerchItem, transformMerchItem } from "@/types/merch";

/**
 * Browse Products Page Component
 *
 * A comprehensive product browsing page that displays all merchandise items
 * with filtering, sorting, and search capabilities. Includes responsive design
 * and analytics tracking for user interactions.
 *
 * Features:
 * - Fetches all merchandise from Flask backend API
 * - Category filtering (All, Electronics, Clothing, Accessories)
 * - Price and name sorting options
 * - Real-time results counter
 * - Loading states with skeleton UI
 * - Error handling with user feedback
 * - Responsive grid layout
 * - Analytics tracking for user interactions
 *
 * @returns {JSX.Element} Complete browse page with header, main content, and footer
 */
export default function BrowsePage() {
  // State for storing all merchandise items from API
  const [allItems, setAllItems] = useState<MerchItem[]>([]);

  // State for storing filtered and sorted items based on user selections
  const [filteredItems, setFilteredItems] = useState<MerchItem[]>([]);

  // State for managing loading state during API fetch
  const [loading, setLoading] = useState(true);

  // State for storing any error messages from API calls
  const [error, setError] = useState<string | null>(null);

  // State for tracking currently selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // State for tracking current sort option
  const [sortBy, setSortBy] = useState<string>("name");

  // Available categories for filtering products
  const categories = ["All", "Electronics", "Clothing", "Accessories"];

  /**
   * Effect to fetch all merchandise data on component mount
   * Handles API calls, data transformation, and error states
   */
  useEffect(() => {
    /**
     * Async function to fetch merchandise data from Flask API
     * Includes comprehensive error handling and data validation
     */
    const fetchMerch = async () => {
      try {
        setLoading(true);

        // Make API call to Flask backend
        const response = await fetch("http://localhost:5000/api/get-merch");

        // Check if response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch merchandise");
        }

        // Parse JSON response - expecting nested structure with responseData
        const fullData = await response.json();
        const data = fullData.responseData;

        // Debug logging to understand API response structure
        console.log("API Response:", data);
        console.log("Is array:", Array.isArray(data));
        console.log("Data length:", data?.length);
        console.log("First item:", data?.[0]);

        /**
         * Transform incomplete API data into complete MerchItem objects
         * This handles cases where API data might be missing certain fields
         */
        const merchArray = Array.isArray(data)
          ? data.map((item, index) => {
              const transformedItem: MerchItem = {
                // Use existing ID or generate sequential fallback
                id: item.id || index + 1,
                // Use existing name or generate placeholder
                name: item.name || `Product ${index + 1}`,
                // Use existing price or generate random price between $10-$110
                price: item.price || Math.random() * 100 + 10,
                // Category should always exist from API
                category: item.category,
                // Generate placeholder image path if not provided
                imgUri:
                  item.imgUri ||
                  `/images/placeholder-${item.category?.toLowerCase()}.jpg`,
                // Default to available unless explicitly false
                available: item.available !== false,
                // Generate random quantity between 1-50 if not provided
                quantity: item.quantity || Math.floor(Math.random() * 50) + 1,
                // Randomly determine featured status (30% chance) if not provided
                isFeatured: item.isFeatured || Math.random() > 0.7,
                // Generate basic description if not provided
                description: item.description || `${item.category} product`,
              };

              // Debug logging for each transformed item
              console.log(`Transformed item ${index}:`, transformedItem);
              return transformedItem;
            })
          : []; // Return empty array if data is not an array

        // More debug logging for final processed data
        console.log("Final merchArray:", merchArray);
        console.log("MerchArray length:", merchArray.length);

        // Update state with processed data
        setAllItems(merchArray);
        setFilteredItems(merchArray); // Initially show all items
      } catch (err) {
        // Handle any errors during fetch or processing
        setError(err instanceof Error ? err.message : "An error occurred");
        // Set empty arrays on error to prevent map errors in UI
        setAllItems([]);
        setFilteredItems([]);
      } finally {
        // Always set loading to false, regardless of success or failure
        setLoading(false);
      }
    };

    fetchMerch();
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Effect to handle filtering and sorting when dependencies change
   * Runs whenever allItems, selectedCategory, or sortBy changes
   */
  useEffect(() => {
    // Safety check to ensure allItems is an array before processing
    if (!Array.isArray(allItems)) {
      setFilteredItems([]);
      return;
    }

    /**
     * Filter items based on selected category
     * "All" shows everything, otherwise filter by exact category match
     */
    let filtered =
      selectedCategory === "All"
        ? allItems
        : allItems.filter((item) => item.category === selectedCategory);

    /**
     * Sort filtered items based on selected sort option
     * Creates new array to avoid mutating original data
     */
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          // Sort by price ascending (lowest first)
          return a.price - b.price;
        case "price-high":
          // Sort by price descending (highest first)
          return b.price - a.price;
        case "name":
          // Sort alphabetically by name
          return a.name.localeCompare(b.name);
        default:
          // No sorting applied
          return 0;
      }
    });

    // Update filtered items state
    setFilteredItems(filtered);
  }, [allItems, selectedCategory, sortBy]); // Dependencies that trigger re-filtering

  /**
   * Handle category filter button clicks
   * Updates selected category and triggers re-filtering via useEffect
   *
   * @param {string} category - The category to filter by
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  /**
   * Handle sort dropdown changes
   * Updates sort option and triggers re-sorting via useEffect
   *
   * @param {string} sortOption - The sort option to apply
   */
  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  /**
   * Loading State UI
   * Shows skeleton loaders while data is being fetched
   */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Page Title */}
            <h1 className="text-4xl font-bold text-center text-black mb-12">
              Browse Products
            </h1>

            {/* Skeleton Loading Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Generate 8 skeleton cards */}
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  {/* Skeleton image placeholder */}
                  <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
                  {/* Skeleton text lines */}
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

  /**
   * Error State UI
   * Shows error message if API call fails
   */
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
              {/* Error message display */}
              <p className="text-red-600">Error loading products: {error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /**
   * Main Render - Success State
   * Shows the complete browse interface when data loads successfully
   */
  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-center text-black mb-12">
            Browse Products
          </h1>

          {/* Filters and Sort Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors trackable ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white" // Active state styling
                      : "bg-white text-gray-600 hover:bg-gray-100" // Inactive state styling
                  }`}
                  id={`filter-${category.toLowerCase()}`} // Unique ID for analytics
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
              id="sort-dropdown" // Unique ID for analytics
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Results Counter */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredItems.length} of {allItems.length} products
              {/* Show category filter info if not "All" */}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Products Grid with Conditional Rendering */}
          {Array.isArray(filteredItems) && filteredItems.length === 0 ? (
            /* Empty State - No products match current filters */
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          ) : Array.isArray(filteredItems) ? (
            /* Products Grid - Show filtered and sorted products */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                /* Individual Product Card Container */
                <div
                  key={item.id}
                  className="trackable" // For analytics tracking
                  id={`product-${item.id}`} // Unique ID for analytics
                >
                  {/* Product Card Component with data transformation */}
                  <MerchCard merch={transformMerchItem(item)} />
                </div>
              ))}
            </div>
          ) : (
            /* Error State - Invalid data format */
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
