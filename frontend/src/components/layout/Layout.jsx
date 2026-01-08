import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
    const location = useLocation()

    // Check if path includes 'user' or 'admin'
    const shouldHideFooter = location.pathname.includes('/user') || location.pathname.includes('/admin')

    return (
        <>
            <Header />
            <main className={`min-h-screen`}>
                <Outlet />
            </main>
            <div className={shouldHideFooter ? "hidden" : ""}>
                <Footer />
            </div>
        </>
    )
}

export default Layout