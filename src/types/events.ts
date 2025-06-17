// Base event interface that all events must implement
export interface BaseEvent {
  sessionId: string;
  eventId: string;
  timestamp: string;
  received_at: string;
  eventType:
    | "click"
    | "page_view"
    | "form_submit"
    | "conversion"
    | "navigation";
  elementId?: string;
  elementTag?: string;
  url?: string;
  userAgent?: string;
}

// Specific event types
export interface ClickEvent extends BaseEvent {
  eventType: "click";
  action?:
    | "add_to_cart"
    | "remove_from_cart"
    | "view_product"
    | "checkout"
    | "wishlist_toggle";
  productId?: string;
  productName?: string;
  productPrice?: number;
  clickX?: number;
  clickY?: number;
}

export interface ConversionEvent extends BaseEvent {
  eventType: "conversion";
  action: "checkout_completed";
  total: number;
  itemCount: number;
  promoCodeUsed?: string;
  paymentMethod?: string;
  shippingMethod?: string;
  itemsDetail: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface PageViewEvent extends BaseEvent {
  eventType: "page_view";
  path: string;
  referrer?: string;
  title?: string;
  loadTime?: number;
  viewport?: string;
}

export interface FormSubmitEvent extends BaseEvent {
  eventType: "form_submit";
  formId?: string;
  formName?: string;
  action?: string;
  fieldCount?: number;
  isValid?: boolean;
  errors?: string[];
}

export interface NavigationEvent extends BaseEvent {
  eventType: "navigation";
  action?: "navigate" | "back" | "forward";
  fromPath?: string;
  toPath?: string;
  navigationType?: "click" | "direct" | "reload";
}
