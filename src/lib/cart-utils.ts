// Cart management utilities
export interface CartItem {
  productId: string;
  quantity: number;
}

const CART_KEY = "atelier_cart";
const WISHLIST_KEY = "atelier_wishlist";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

export function addToCart(productId: string, quantity: number = 1): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = getCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // debug
  // eslint-disable-next-line no-console
  console.log("cart-utils: addToCart ->", productId, quantity, cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = getCart().filter((item) => item.productId !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // eslint-disable-next-line no-console
  console.log("cart-utils: removeFromCart ->", productId, cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = getCart();
  const item = cart.find((item) => item.productId === productId);

  if (item) {
    item.quantity = Math.max(0, quantity);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // eslint-disable-next-line no-console
  console.log("cart-utils: updateCartQuantity ->", productId, quantity, cart);
  return cart;
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

// Wishlist management utilities
export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const wishlist = localStorage.getItem(WISHLIST_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch {
    return [];
  }
}

export function addToWishlist(productId: string): string[] {
  if (typeof window === "undefined") return [];
  const wishlist = getWishlist();

  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  // eslint-disable-next-line no-console
  console.log("cart-utils: addToWishlist ->", productId, wishlist);
  return wishlist;
}

export function removeFromWishlist(productId: string): string[] {
  if (typeof window === "undefined") return [];
  const wishlist = getWishlist().filter((id) => id !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  // eslint-disable-next-line no-console
  console.log("cart-utils: removeFromWishlist ->", productId, wishlist);
  return wishlist;
}

export function isInWishlist(productId: string): boolean {
  if (typeof window === "undefined") return false;
  return getWishlist().includes(productId);
}

export function isInCart(productId: string): boolean {
  if (typeof window === "undefined") return false;
  return getCart().some((it) => it.productId === productId);
}

export function clearWishlist(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WISHLIST_KEY);
}
