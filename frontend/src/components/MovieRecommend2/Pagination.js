import { useEffect, useRef } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import styles from './Pagination.module.css'
import StateHandler from '@/utils/Statehandler.js'

const Pagination = () => 
{
    const firstRender = useRef(false)    
    const allAdaptedMovies = StateHandler((state) => { return state.allAdaptedMovies })    
    const currentPageNumber = StateHandler((state) => { return state.currentPageNumber })
    const incrementPageNumber = StateHandler((state) => { return state.incrementPageNumber })
    const decrementPageNumber = StateHandler((state) => { return state.decrementPageNumber })
    const setMovies = StateHandler((state) => { return state.setMovies })

    useEffect(() => 
    {
        if(firstRender.current)
        {
            setMovies(currentPageNumber)    
        }
        else
        {
            firstRender.current = true
        }
    }, [currentPageNumber])

    return (
        <>                           
            <div className = { styles.pagination }>
                <div className = { styles.currentPageNumber }>
                    <span>{ Math.floor(((currentPageNumber / 10)) + 1)+'/'+ Math.ceil((allAdaptedMovies / 10)) }</span>
                </div>
                <div className = { styles.transitionButtons }>
                    <button className = { styles.leftTransitionButton } onClick = { () => { decrementPageNumber() } }>
                        <span className = { styles.transitionButtonIcon }><FaArrowLeft/></span>                        
                    </button>
                    <button className = { styles.rightTransitionButton } onClick = { () => { incrementPageNumber() } }>
                        <span className = { styles.transitionButtonIcon }><FaArrowRight/></span>                        
                    </button>
                </div>
            </div>                                 
        </>
    )
}

export default Pagination