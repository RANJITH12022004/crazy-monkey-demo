import type { MenuCategory } from '@/types/analytics'

export type Cuisine =
  | 'chinese'
  | 'italian'
  | 'dessert'
  | 'indian'
  | 'mexican'
  | 'beverages'

export type MenuCuisine = Exclude<Cuisine, 'beverages'>

export interface MenuItemRow {
  id: string
  name: string
  description: string | null
  price: number
  category: MenuCategory
  cuisine: Cuisine
  image_url: string | null
  is_veg: boolean
  is_bestseller: boolean
}

export type MenuFilter = 'all' | 'bestsellers' | 'veg'
