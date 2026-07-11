import { Link, useParams } from 'react-router-dom'
import { CustomerBackLink } from '@/components/customer/OrderLayout'
import {
  CHINESE_HERO_URL,
  DESSERT_HERO_URL,
  INDIAN_HERO_URL,
  ITALIAN_HERO_URL,
  LOGO_URL,
  MEXICAN_HERO_URL,
  RESTAURANT_NAME,
} from '@/constants/branding'

const CUISINES = [
  {
    id: 'chinese',
    title: 'Chinese',
    subtitle: 'Wok-tossed classics & dim sum',
    image: CHINESE_HERO_URL,
  },
  {
    id: 'italian',
    title: 'Italian',
    subtitle: 'Wood-fired pizza & pasta',
    image: ITALIAN_HERO_URL,
  },
  {
    id: 'indian',
    title: 'Indian',
    subtitle: 'Curries, tandoor & biryani',
    image: INDIAN_HERO_URL,
  },
  {
    id: 'mexican',
    title: 'Mexican',
    subtitle: 'Tacos, bowls & nachos',
    image: MEXICAN_HERO_URL,
  },
  {
    id: 'dessert',
    title: 'Desserts',
    subtitle: 'Sweet finishes & gelato',
    image: DESSERT_HERO_URL,
  },
] as const

export default function CuisinePickerPage() {
  const { tableId = '' } = useParams()

  return (
    <main className="min-h-screen px-margin-mobile pb-28 pt-md">
      <CustomerBackLink to={`/order/${tableId}`} label="Back" />
      <div className="mt-md flex items-center gap-md">
        <img src={LOGO_URL} alt={RESTAURANT_NAME} className="h-14 w-14 rounded-full object-cover" />
        <div>
          <h1 className="text-2xl font-bold text-primary">Choose a menu</h1>
          <p className="text-sm text-on-surface-variant">
            Chinese, Italian, Indian, Mexican, or Desserts
          </p>
        </div>
      </div>

      <div className="mt-lg flex flex-col gap-lg">
        {CUISINES.map((cuisine) => (
          <Link
            key={cuisine.id}
            to={`/order/${tableId}/menu/${cuisine.id}`}
            className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-sm"
          >
            <div className="h-44 w-full overflow-hidden">
              <img src={cuisine.image} alt={cuisine.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-md">
              <h2 className="text-xl font-bold text-on-surface">{cuisine.title}</h2>
              <p className="text-sm text-on-surface-variant">{cuisine.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
