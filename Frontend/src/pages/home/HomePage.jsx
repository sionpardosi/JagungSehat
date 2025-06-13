import { useEffect } from 'react'
import { initSmoothScroll } from '../../libs/utils/smoothScroll'
import Header from "../../components/fragments/Header"
import Guide from "../../components/fragments/Guide"
import About from "../../components/fragments/About"
import DiseaseInfo from '../../components/fragments/DiseaseInfo'
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

            <Guide id="guide" />

            <DiseaseInfo id="disease-info" />
        </main>
    )
}