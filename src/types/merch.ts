/**
 * Type definition for merchandise item data
 * Used across all components for consistent typing
 */
export interface MerchItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imgUri: string;
  available: boolean;
  quantity: number;
  isFeatured: boolean;
  category: string;
}

/**
 * Type definition for merchandise item used in UI components
 * Transformed version of MerchItem with standardized field names
 */
export type Merch = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
};

/**
 * Utility function to transform MerchItem to Merch for UI components
 *
 * @param {MerchItem} item - Raw merchandise item from API
 * @returns {Merch} Transformed merchandise item for UI components
 */
export const transformMerchItem = (item: MerchItem): Merch => ({
  id: item.id.toString(),
  name: item.name,
  description: item.description || `${item.category} - Qty: ${item.quantity}`,
  price: item.price,
  imageUrl: item.imgUri,
  inStock: item.available,
});
