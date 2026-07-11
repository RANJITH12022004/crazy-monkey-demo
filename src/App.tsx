import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StaffProvider } from '@/context/StaffContext'
import { StaffRouteGuard } from '@/components/StaffRouteGuard'
import { OrderLayout } from '@/components/customer/OrderLayout'
import StaffLoginPage from '@/pages/StaffLoginPage'
import KitchenDashboardPage from '@/pages/KitchenDashboardPage'
import StockDashboardPage from '@/pages/StockDashboardPage'
import OwnerDashboardPage from '@/pages/OwnerDashboardPage'
import DemoLauncherPage from '@/pages/DemoLauncherPage'
import WelcomePage from '@/pages/order/WelcomePage'
import CuisinePickerPage from '@/pages/order/CuisinePickerPage'
import CuisineMenuPage from '@/pages/order/CuisineMenuPage'
import CartPage from '@/pages/order/CartPage'
import TrackOrderPage from '@/pages/order/TrackOrderPage'

export default function App() {
  return (
    <StaffProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/demo" replace />} />
          <Route path="/demo" element={<DemoLauncherPage />} />

          <Route path="/order/:tableId" element={<OrderLayout />}>
            <Route index element={<WelcomePage />} />
            <Route path="menu" element={<CuisinePickerPage />} />
            <Route path="menu/:cuisine" element={<CuisineMenuPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="track/:orderId" element={<TrackOrderPage />} />
          </Route>

          <Route path="/staff" element={<StaffLoginPage />} />
          <Route element={<StaffRouteGuard requiredRole="kitchen" />}>
            <Route path="/kitchen" element={<KitchenDashboardPage />} />
          </Route>
          <Route element={<StaffRouteGuard requiredRole="stock" />}>
            <Route path="/stock" element={<StockDashboardPage />} />
          </Route>
          <Route element={<StaffRouteGuard requiredRole="owner" />}>
            <Route path="/owner" element={<OwnerDashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/demo" replace />} />
        </Routes>
      </BrowserRouter>
    </StaffProvider>
  )
}
