import { useEffect } from 'react'
import { initSmoothScroll } from '../../libs/utils/smoothScroll'
import Header from "../../components/fragments/Header"
import Panduan from "../../components/fragments/Panduan"
import About from "../../components/fragments/About"
import Services from "../../components/fragments/Service"
import DiseaseInfo from '../../components/fragments/DiseaseInfo'
import Contact from '../../components/fragments/Contact'
import "../../App.css"

export default function HomePage() {
    useEffect(() => {
        const scroll = initSmoothScroll()

        return () => {
            scroll.destroy()
        }
    }, [])

    return (
        <main>
            <Header id="header" />

            <About id="about" />

            <Panduan id="panduan" />

            <Services id="services" />

            <DiseaseInfo id="disease-info" />

            <Contact id="contact" />
        </main>
    )
}