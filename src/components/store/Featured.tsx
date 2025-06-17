"use client";
import { useEffect, useState } from "react";
import useAnalytics from "@/hooks/useAnalytics";
import MerchCard from "@/components/store/subcomponents/MerchCard";
import { MerchItem, transformMerchItem } from "@/types/merch";

/**
 * Featured Products Component
 *
 * Displays a grid of featured merchandise items fetched from the API.
 * Uses shared types and transformation utilities for consistency.
 */
const Featured = () => {
  const [featuredItems, setFeaturedItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/get-merch");

        if (!response.ok) {
          throw new Error("Failed to fetch merchandise");
        }

        const data = await response.json();
        const parsedData: MerchItem[] = data;

        // Filter only featured items
        const featured = parsedData.filter((item) => item.isFeatured);
        setFeaturedItems(featured);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMerch();
  }, []);

  const handleCardClick = (item: MerchItem) => {
    const element = document.activeElement as HTMLElement;
    if (element) {
      trackEvent("click", element, {
        productId: item.id,
        productName: item.name,
        productPrice: item.price,
        productCategory: item.category,
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
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
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-black">
              Featured Products
            </h2>
            <p className="text-red-600">Error loading products: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">
          Featured Products
        </h2>

        {featuredItems.length === 0 ? (
          <p className="text-center text-gray-600">
            No featured products available.
          </p>
        ) : (
          <div className="featured-products-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 justify-items-center max-w-7xl mx-auto">
            {featuredItems.map((item) => (
              <article
                key={`featured-product-${item.id}`}
                className="featured-item trackable hover:scale-105 transition-transform duration-200"
                id={`featured-item-${item.id}`}
                onClick={() => handleCardClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCardClick(item);
                  }
                }}
              >
                {/* Use the transformation utility */}
                <MerchCard merch={transformMerchItem(item)} />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Featured;
