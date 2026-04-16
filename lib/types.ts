export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  old_price: number | null
  image_url: string | null
  images: string[]
  volume: string | null
  brand: string | null
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_telegram: string | null
  customer_email: string | null
  items: OrderItem[]
  total: number
  status: 'new' | 'processing' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  link: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  slug: string
  title: string
  content: string | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface SiteSettings {
  site_name: string
  site_description: string
  phone: string
  email: string
  telegram: string
  address: string
  working_hours: string
}
