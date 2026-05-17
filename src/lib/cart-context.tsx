"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  CartItem,
  getCart,
  addToCart as addToCartStorage,
  removeFromCart as removeFromCartStorage,
  updateCartQuantity as updateCartQuantityStorage,
  clearCart as clearCartStorage,
  getWishlist,
  addToWishlist as addToWishlistStorage,
  removeFromWishlist as removeFromWishlistStorage,
  isInWishlist as checkIsInWishlist,
  clearWishlist as clearWishlistStorage,
} from "./cart-utils";

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => getWishlist());

  const handleAddToCart = useCallback((productId: string, quantity = 1) => {
    // debug
    // eslint-disable-next-line no-console
    console.log("cart-context: handleAddToCart called ->", productId, quantity);
    const updatedCart = addToCartStorage(productId, quantity);
    setCart(updatedCart);
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    // debug
    // eslint-disable-next-line no-console
    console.log("cart-context: handleRemoveFromCart called ->", productId);
    const updatedCart = removeFromCartStorage(productId);
    setCart(updatedCart);
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: string, quantity: number) => {
    // debug
    // eslint-disable-next-line no-console
    console.log("cart-context: handleUpdateCartQuantity ->", productId, quantity);
    const updatedCart = updateCartQuantityStorage(productId, quantity);
    setCart(updatedCart);
  }, []);

  const handleClearCart = useCallback(() => {
    clearCartStorage();
    setCart([]);
  }, []);

  const handleAddToWishlist = useCallback((productId: string) => {
    // debug
    // eslint-disable-next-line no-console
    console.log("cart-context: handleAddToWishlist ->", productId);
    const updatedWishlist = addToWishlistStorage(productId);
    setWishlist(updatedWishlist);
  }, []);

  const handleRemoveFromWishlist = useCallback((productId: string) => {
    // debug
    // eslint-disable-next-line no-console
    console.log("cart-context: handleRemoveFromWishlist ->", productId);
    const updatedWishlist = removeFromWishlistStorage(productId);
    setWishlist(updatedWishlist);
  }, []);

  const handleIsInWishlist = useCallback((productId: string) => {
    return checkIsInWishlist(productId);
  }, []);

  const handleIsInCart = useCallback((productId: string) => {
    return getCart().some((it) => it.productId === productId);
  }, []);

  const handleClearWishlist = useCallback(() => {
    clearWishlistStorage();
    setWishlist([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateCartQuantity: handleUpdateCartQuantity,
        clearCart: handleClearCart,
        addToWishlist: handleAddToWishlist,
        removeFromWishlist: handleRemoveFromWishlist,
          isInWishlist: handleIsInWishlist,
          isInCart: handleIsInCart,
        clearWishlist: handleClearWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
