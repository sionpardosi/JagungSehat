import SmoothScroll from 'smooth-scroll'

export const initSmoothScroll = () => {
    return new SmoothScroll('a[href*="#"]', {
        speed: 1000,
        speedAsDuration: true,
        offset: 50
    })
}  