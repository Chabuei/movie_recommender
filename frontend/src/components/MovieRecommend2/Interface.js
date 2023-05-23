import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './Interface.module.css'
import Contents from './Contents.js'
import Pagination from './Pagination.js'
import Information from './Information.js'
import StateHandler from '@/utils/Statehandler.js'

const Interface = ({ _ }) => 
{
    const cardsElement = useRef(null)
    const renderFlag = useRef(0)
    const currentLeftTrigger = StateHandler((state) => { return state.currentLeftTrigger })
    const currentRightTrigger = StateHandler((state) => { return state.currentRightTrigger })

    useEffect(() => 
    {
        if(renderFlag.current)
        {            
            const timeline = gsap.timeline({})
            timeline.add(gsap.to(cardsElement.current, { x: -7, duration: 0.25, opacity:0, ease: 'linear' }))
            timeline.add(gsap.to(cardsElement.current, { x: 7, duration: 0 }))
            timeline.add(gsap.to(cardsElement.current, { x: 0, opacity: 1, duration: 0.75, ease: 'expo.out' }))
        }
        else
        {
            renderFlag.current = true
        }
    }, [currentRightTrigger])

    useEffect(() => 
    {
        if(renderFlag.current)
        {
            const timeline = gsap.timeline({})
            timeline.add(gsap.to(cardsElement.current, { x: 7, duration: 0.25, opacity:0, ease: 'linear' }))
            timeline.add(gsap.to(cardsElement.current, { x: -7, duration: 0 }))
            timeline.add(gsap.to(cardsElement.current, { x: 0, opacity: 1, duration: 0.75, ease: 'expo.out' }))
        }
        else
        {
            renderFlag.current = true
        }
    }, [currentLeftTrigger])

    return (
        <>
            <div>
                <Information/>
            </div>
            <div ref = { cardsElement } className = { styles.contents }>
                <Contents/>
            </div>
            <div className = { styles.pagination }>
                <Pagination/>
            </div>
        </>
    )
}

export default Interface