import { CartProvider } from "@/contexts/CartContext";

/**
 * Store Layout Component
 *
 * Layout specifically for the e-commerce store section.
 * Wraps only store pages with CartProvider to provide cart functionality.
 *
 * @param {Object} props - Layout props
 * @param {React.ReactNode} props.children - Store page components
 * @returns {JSX.Element} Store layout with cart functionality
 */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
