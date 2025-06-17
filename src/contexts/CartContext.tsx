"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Merch } from "@/types/merch";
import { getSessionId } from "@/utils/sessionManager";

/**
 * Type definition for cart item
 * Extends the Merch type and adds cart-specific quantity field
 */
export interface CartItem extends Merch {
  quantity: number;
}

/**
 * Cart context type definition
 */
interface CartContextType {
  cartItems: CartItem[];
  sessionId: string;
  addToCart: (item: Merch, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

/**
 * Cart context with default values
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Cookie management utilities for cart persistence
 */
const CART_COOKIE_NAME = "shopping_cart";
const COOKIE_EXPIRY_DAYS = 7;

/**
 * Set cookie with cart data
 *
 * @param {CartItem[]} cartItems - Array of cart items to store
 */
const setCartCookie = (cartItems: CartItem[]) => {
  try {
    const cartData = JSON.stringify(cartItems);
    const expires = new Date();
    expires.setTime(
      expires.getTime() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(
      cartData
    )};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  } catch (error) {
    console.error("Error setting cart cookie:", error);
  }
};

/**
 * Get cart data from cookie
 *
 * @returns {CartItem[]} Array of cart items from cookie
 */
const getCartCookie = (): CartItem[] => {
  try {
    if (typeof document === "undefined") return []; // SSR safety

    const cookies = document.cookie.split(";");
    const cartCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${CART_COOKIE_NAME}=`)
    );

    if (!cartCookie) return [];

    const cartData = decodeURIComponent(cartCookie.split("=")[1]);
    return JSON.parse(cartData) || [];
  } catch (error) {
    console.error("Error reading cart cookie:", error);
    return [];
  }
};

/**
 * Clear cart cookie
 */
const clearCartCookie = () => {
  document.cookie = `${CART_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Cart Provider Component
 *
 * Manages cart state and persistence using cookies
 * Now includes session tracking for analytics
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  /**
   * Initialize session and load cart data on component mount
   */
  useEffect(() => {
    // Get or create session ID
    const currentSessionId = getSessionId();
    setSessionId(currentSessionId);

    // Load cart data from cookie
    const savedCart = getCartCookie();
    setCartItems(savedCart);
    setIsInitialized(true);

    console.log("Cart initialized for session:", currentSessionId);
  }, []);

  /**
   * Save cart to cookie whenever cart items change
   * Only save after initial load to prevent overwriting on SSR
   */
  useEffect(() => {
    if (isInitialized) {
      setCartCookie(cartItems);

      // Optional: Log cart changes with session info
      console.log(`Cart updated for session ${sessionId}:`, {
        itemCount: cartItems.length,
        totalItems: getTotalItems(),
        totalValue: getTotalPrice(),
      });
    }
  }, [cartItems, isInitialized, sessionId]);

  /**
   * Add item to cart or update quantity if item exists
   *
   * @param {Merch} item - Merchandise item to add
   * @param {number} quantity - Quantity to add (default: 1)
   */
  const addToCart = (item: Merch, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Add new item to cart (spread Merch properties and add quantity)
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  /**
   * Remove item completely from cart
   *
   * @param {string} itemId - ID of item to remove
   */
  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  /**
   * Update quantity of specific cart item
   *
   * @param {string} itemId - ID of item to update
   * @param {number} quantity - New quantity (removes item if 0 or less)
   */
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    setCartItems([]);
    clearCartCookie();
  };

  /**
   * Get total number of items in cart
   *
   * @returns {number} Total item count
   */
  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Get total price of all items in cart
   *
   * @returns {number} Total price
   */
  const getTotalPrice = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Context value object with session info
  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    sessionId, // Add session ID to context if needed
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

/**
 * Hook to use cart context
 *
 * @returns {CartContextType} Cart context value
 * @throws {Error} If used outside of CartProvider
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
