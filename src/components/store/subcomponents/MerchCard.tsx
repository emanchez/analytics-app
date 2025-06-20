"use client";
import React, { useState } from "react";
import { Merch } from "@/types/merch";
import { useCart } from "@/contexts/CartContext";
import useAnalytics from "@/hooks/useAnalytics";

/**
 * Props for the MerchCard component
 */
type MerchCardProps = {
  merch: Merch;
};

/**
 * MerchCard Component
 *
 * A reusable product card component that displays merchandise information
 * with interactive features like wishlist toggle, add to cart, and quick view.
 * Includes comprehensive analytics tracking for user interactions.
 *
 * Features:
 * - Product image with error handling and placeholder
 * - Wishlist functionality with visual feedback
 * - Stock status indication
 * - Price display with discount information
 * - Interactive buttons for cart and quick view
 * - Analytics tracking for all user interactions
 *
 * @param {MerchCardProps} props - Component props containing merchandise data
 * @returns {JSX.Element} Rendered product card component
 */
const MerchCard: React.FC<MerchCardProps> = ({ merch }) => {
  // State for managing image load errors
  const [imageError, setImageError] = useState(false);

  // State for managing wishlist status
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Cart context for adding items to cart
  const { addToCart } = useCart();

  // Analytics hook for tracking user interactions
  const { trackEvent } = useAnalytics();

  /**
   * Handle image loading errors by setting error state
   * This prevents broken image display and shows placeholder instead
   */
  const handleImageError = () => {
    setImageError(true);
  };

  /**
   * Toggle wishlist status and track the interaction
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - Click event from wishlist button
   */
  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);

    // Track wishlist toggle event
    trackEvent({
      eventType: "click",
      action: "wishlist_toggle",
      elementId: `wishlist-${merch.id}`,
      productId: merch.id,
      productName: merch.name,
      productPrice: merch.price,
      isWishlisted: !isWishlisted,
    });
  };

  /**
   * Handle add to cart action and track the interaction
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - Click event from add to cart button
   */
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(merch);

    // Track add to cart event
    trackEvent({
      eventType: "click",
      action: "add_to_cart",
      elementId: `add-to-cart-${merch.id}`,
      productId: merch.id,
      productName: merch.name,
      productPrice: merch.price,
      inStock: merch.inStock,
    });
  };

  /**
   * Handle quick view action and track the interaction
   *
   * @param {React.MouseEvent<HTMLButtonElement>} e - Click event from quick view button
   */
  const handleQuickView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Track quick view event
    trackEvent({
      eventType: "click",
      action: "quick_view",
      elementId: `quick-view-${merch.id}`,
      productId: merch.id,
      productName: merch.name,
      productPrice: merch.price,
    });
  };

  /**
   * Handle product card click (view product event)
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - Click event from product card
   */
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only track if clicking the card itself, not buttons
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest(".card-content")
    ) {
      trackEvent({
        eventType: "click",
        action: "view_product",
        elementId: `product-card-${merch.id}`,
        productId: merch.id,
        productName: merch.name,
        productPrice: merch.price,
      });
    }
  };

  /**
   * SVG placeholder image data URL for when product images fail to load
   * Creates a simple gray placeholder with "No Image Available" text
   */
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23666' text-anchor='middle' dy='.3em'%3ENo Image Available%3C/text%3E%3C/svg%3E";

  // Original heart icon SVG
  const HeartIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
    </svg>
  );

  // Original star icon SVG
  const StarIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );

  // Original eye icon SVG
  const EyeIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5S21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm mx-auto overflow-hidden cursor-pointer"
      onClick={handleCardClick}
      id={`product-card-${merch.id}`}
    >
      {/* Image Container with Overlay Elements */}
      <div className="relative">
        {/* Product Image with Error Handling */}
        {!imageError ? (
          <img
            src={merch.imageUrl}
            alt={merch.name}
            className="w-full h-48 object-cover"
            onError={handleImageError}
          />
        ) : (
          <img
            src={placeholderImage}
            alt="No image available"
            className="w-full h-48 object-cover"
          />
        )}

        {/* Wishlist Toggle Button - Positioned in top-right corner */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${
            isWishlisted
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50"
          }`}
          id={`wishlist-${merch.id}`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon />
        </button>

        {/* Stock Status Badge - Positioned in top-left corner */}
        <div
          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
            merch.inStock
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {merch.inStock ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-4 card-content">
        {/* Product Name - Truncated to 2 lines max */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {merch.name}
        </h3>

        {/* Product Description - Truncated to 2 lines max */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {merch.description}
        </p>

        {/* Mock Rating Display - Shows 5-star rating with review count */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {/* Generate 5 star icons */}
            {Array.from({ length: 5 }, (_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-2">(4.5)</span>
          <span className="text-gray-400 text-sm ml-1">• 124 reviews</span>
        </div>

        {/* Pricing Section with Discount Information */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {/* Current Price */}
            <span className="text-2xl font-bold text-gray-900">
              ${merch.price.toFixed(2)}
            </span>
            {/* Original Price (calculated as 20% higher) */}
            <span className="text-sm text-gray-500 line-through">
              ${(merch.price * 1.2).toFixed(2)}
            </span>
            {/* Discount Percentage */}
            <span className="text-sm text-green-600 font-medium">17% off</span>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex space-x-2 mb-4">
          {/* Add to Cart Button - Full width, disabled when out of stock */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              merch.inStock
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            id={`add-to-cart-${merch.id}`}
            disabled={!merch.inStock}
            aria-label={`Add ${merch.name} to cart`}
          >
            {merch.inStock ? "Add to Cart" : "Sold Out"}
          </button>

          {/* Quick View Button - Icon only, opens product details */}
          <button
            onClick={handleQuickView}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            id={`quick-view-${merch.id}`}
            aria-label={`Quick view ${merch.name}`}
          >
            <EyeIcon />
          </button>
        </div>

        {/* Feature Tags Section - Promotional badges */}
        <div className="flex flex-wrap gap-1">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Free Shipping
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            Best Seller
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Eco-Friendly
          </span>
        </div>
      </div>
    </div>
  );
};

export default MerchCard;
