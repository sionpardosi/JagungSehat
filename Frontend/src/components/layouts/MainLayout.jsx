import { Outlet } from 'react-router'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}