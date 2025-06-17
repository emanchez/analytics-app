"use client";
import { useState } from "react";
import StoreHeader from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { useCart } from "@/contexts/CartContext";
import useAnalytics from "@/hooks/useAnalytics";

/**
 * Shopping Cart Page Component
 *
 * A comprehensive shopping cart interface that displays added items,
 * allows quantity modifications, and provides checkout functionality.
 * Now uses CartContext for persistent cart management with cookies.
 * Includes comprehensive analytics tracking for all cart interactions.
 *
 * Features:
 * - Display cart items with product details from CartContext
 * - Quantity adjustment controls with persistent storage
 * - Remove items functionality
 * - Subtotal and total calculations
 * - Promo code application with tracking
 * - Checkout process initiation with detailed analytics
 * - Empty cart state handling
 * - Analytics tracking for all cart events
 *
 * @returns {JSX.Element} Complete cart page with header, cart contents, and footer
 */
const CartPage = () => {
  // Use CartContext instead of local state
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCart();

  // Analytics hook for tracking user interactions
  const { trackEvent } = useAnalytics();

  // State for promo code input
  const [promoCode, setPromoCode] = useState("");

  // State for managing loading state during checkout
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  /**
   * Calculate subtotal of all items in cart
   * Uses CartContext getTotalPrice method
   *
   * @returns {number} Subtotal amount
   */
  const calculateSubtotal = () => {
    return getTotalPrice();
  };

  /**
   * Calculate tax (8% for demo)
   *
   * @returns {number} Tax amount
   */
  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  /**
   * Calculate final total including tax
   *
   * @returns {number} Total amount
   */
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  /**
   * Handle quantity update with CartContext and analytics
   *
   * @param {string} itemId - ID of the item to update
   * @param {number} newQuantity - New quantity value
   */
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    const item = cartItems.find((item) => item.id === itemId);
    const oldQuantity = item?.quantity || 0;

    updateQuantity(itemId, newQuantity);

    // Track quantity change
    trackEvent({
      eventType: "click",
      action:
        newQuantity > oldQuantity ? "increase_quantity" : "decrease_quantity",
      elementId:
        newQuantity > oldQuantity ? `increase-${itemId}` : `decrease-${itemId}`,
      productId: itemId,
      productName: item?.name,
      productPrice: item?.price,
      oldQuantity,
      newQuantity,
    });
  };

  /**
   * Handle item removal with CartContext and analytics
   *
   * @param {string} itemId - ID of the item to remove
   */
  const handleRemoveItem = (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    removeFromCart(itemId);

    // Track item removal
    trackEvent({
      eventType: "click",
      action: "remove_from_cart",
      elementId: `remove-${itemId}`,
      productId: itemId,
      productName: item?.name,
      productPrice: item?.price,
      quantity: item?.quantity,
    });
  };

  /**
   * Handle clear cart with analytics
   */
  const handleClearCart = () => {
    const itemCount = getTotalItems();
    const totalValue = getTotalPrice();

    clearCart();

    // Track cart clearing
    trackEvent({
      eventType: "click",
      action: "clear_cart",
      elementId: "clear-cart",
      itemCount,
      totalValue,
    });
  };

  /**
   * Handle promo code application with analytics
   */
  const applyPromoCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Mock promo code logic - you can enhance this later
    console.log("Applying promo code:", promoCode);

    // Track promo code application
    trackEvent({
      eventType: "click",
      action: "apply_promo_code",
      elementId: "apply-promo",
      promoCode: promoCode,
      cartTotal: calculateTotal(),
      itemCount: getTotalItems(),
    });
  };

  /**
   * Handle checkout process initiation with analytics
   */
  const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsCheckingOut(true);

    // Track checkout initiation
    trackEvent({
      eventType: "click",
      action: "initiate_checkout",
      elementId: "checkout-button",
      cartTotal: calculateTotal(),
      itemCount: getTotalItems(),
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    // Mock checkout process with cart data
    setTimeout(() => {
      // Track successful checkout conversion
      trackEvent({
        eventType: "conversion",
        action: "checkout_completed",
        total: calculateTotal(),
        itemCount: getTotalItems(),
        promoCodeUsed: promoCode || undefined,
        itemsDetail: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      alert("Checkout completed!");
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  /**
   * Handle continue shopping link click
   */
  const handleContinueShopping = () => {
    trackEvent({
      eventType: "click",
      action: "continue_shopping",
      elementId: "continue-shopping",
      fromPage: "cart",
      cartItemCount: getTotalItems(),
    });
  };

  /**
   * Handle continue shopping link click from cart page
   */
  const handleContinueShoppingLink = () => {
    trackEvent({
      eventType: "click",
      action: "continue_shopping",
      elementId: "continue-shopping-link",
      fromPage: "cart",
      cartItemCount: getTotalItems(),
    });
  };

  /**
   * Handle promo code input change
   */
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);

    // Track promo code input (debounced)
    if (e.target.value.length > 2) {
      trackEvent({
        eventType: "form_submit",
        action: "promo_code_input",
        elementId: "promo-code-input",
        inputLength: e.target.value.length,
      });
    }
  };

  /**
   * Empty Cart State UI
   * Shows when cart has no items from CartContext
   */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <StoreHeader />
        <main className="flex-1 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🛒</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-600 mb-8 text-lg">
                Add some products to get started
              </p>
              <a
                href="/store/browse"
                onClick={handleContinueShopping}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                id="continue-shopping"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /**
   * Main Cart UI
   * Shows cart items from CartContext and checkout interface
   */
  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Page Title with Item Count */}
          <h1 className="text-4xl font-bold text-center text-black mb-4">
            Shopping Cart
          </h1>
          <p className="text-center text-gray-600 mb-12">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in your
            cart
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg text-black shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Cart Items</h2>
                  {/* Clear Cart Button with Analytics */}
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    id="clear-cart"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                      id={`cart-item-${item.id}`}
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                        <p className="text-blue-600 font-semibold">
                          ${item.price.toFixed(2)} each
                        </p>
                        <p className="text-gray-800 font-medium">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          id={`decrease-${item.id}`}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          id={`increase-${item.id}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        id={`remove-${item.id}`}
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md text-gray-600 p-6 sticky top-4">
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Items ({getTotalItems()})</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-xl font-semibold text-black">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={handlePromoCodeChange}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-800 rounded-lg"
                      id="promo-code-input"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      id="apply-promo"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    isCheckingOut
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  id="checkout-button"
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>

          {/* Continue Shopping Section */}
          <div className="text-center mt-12">
            <a
              href="/store/browse"
              onClick={handleContinueShoppingLink}
              className="text-blue-600 font-medium hover:underline"
              id="continue-shopping-link"
            >
              ← Continue Shopping
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
