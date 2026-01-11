import React from 'react'
import { Route, Routes, ScrollRestoration } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/home/HomePage'
import Rooms from './pages/rooms/Rooms'
import { ThemeProvider } from './components/utilities/ThemeProvider'
import RoomDetails from './pages/rooms/roomDetail.jsx/RoomDetails'
import Location from './pages/location/Location'
import ContactUs from './pages/contactus/ContactUs'
import AboutUs from './pages/about/AboutUs'
import Gallery from './pages/gallery/Gallery'
import AdminDashboard from './pages/authenticatedPages/Admin/AdminDashboard'
import AdminLayoutProvider from './components/layout/AdminLayoutProvider'
import AdminRooms from './pages/authenticatedPages/Admin/AdminRooms'
import AdminBookings from './pages/authenticatedPages/Admin/AdminBookings'
import AdminSettings from './pages/authenticatedPages/Admin/AdminSettings'
import AdminGuest from './pages/authenticatedPages/Admin/AdminGuest'
import AdminContentManagement from './pages/authenticatedPages/Admin/AdminContentManagement'
import AdminBillings from './pages/authenticatedPages/Admin/AdminBillings'
import Policies from './pages/legalpages/Policies'
import Login from './pages/authenticationPages/Login'
import Register from './pages/authenticationPages/Register'
import ForgotPassword from './pages/authenticationPages/ForgotPassword'
import RequireAuth from './pages/authenticationPages/RequireAuth'
import EmailVerification from './pages/authenticationPages/EmailVerification'
import PersistLogin from './pages/authenticationPages/PersistLogin'
import AdminProfile from './pages/authenticatedPages/Admin/AdminProfile'

const App = () => {
  return (
    <div>
      <ThemeProvider>
        <ScrollRestoration />
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path='/' element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/verify-email' element={<EmailVerification />} />
              <Route path='/location' element={<Location />} />
              <Route path='/contact' element={<ContactUs />} />
              <Route path='/about' element={<AboutUs />} />
              <Route path='/policies' element={<Policies />} />
              <Route path='/gallery' element={<Gallery />} />
              <Route path='/rooms'>
                <Route index element={<Rooms />} />
                <Route path=':roomId' element={<RoomDetails />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<RequireAuth allowedRoles={['manager', 'admin']} />}>
                <Route path="admin" element={<AdminLayoutProvider />}>
                  <Route path='dashboard' element={<AdminDashboard />} />
                  <Route path='profile' element={<AdminProfile />} />
                  <Route path="rooms">
                    <Route index element={<AdminRooms />} />
                  </Route>
                  <Route path="reservations">
                    <Route index element={<AdminBookings />} />
                  </Route>
                  <Route path="users">
                  </Route>
                  <Route path="billing" element={<AdminBillings />} />
                  <Route path="content" element={<AdminContentManagement />} />
                  <Route path='guests' element={<AdminGuest />} />
                  <Route path='settings' element={<AdminSettings />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  )
}

export default App