import { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import styles from './Header.module.css'
import StateHandler from '@/utils/Statehandler.js'

const Header = () => 
{    
    const firstRender = useRef(false)
    const [keyword, setKeyword] = useState('')   
    const currentRecommendedMovies = StateHandler((state) => { return state.currentRecommendedMovies }) 
    const setSearchKeyword = StateHandler((state) => { return state.setSearchKeyword })
    const currentState = StateHandler((state) => { return state.currentState })
    const currentPageNumber = StateHandler((state) => { return state.currentPageNumber })
    const setCurrentPageNumber = StateHandler((state) => { return state.setCurrentPageNumber })
    const setCurrentState = StateHandler((state) => { return state.setCurrentState })
    const setSearchResults = StateHandler((state) => { return state.setSearchResults })
    const setMovies = StateHandler((state) => { return state.setMovies })
    const setAllAdaptedMovies = StateHandler((state) => { return state.setAllAdaptedMovies })
    const setRecommendedMovies = StateHandler((state) => { return state.setRecommendedMovies })

    const inputKeyword = (event) => 
    {
        setKeyword(event.target.value)
    }

    const searchKeyword = (keyword) => 
    {
        if(keyword.length >= 1)
        {
            setSearchKeyword(keyword)
            setCurrentState('search')
            setCurrentPageNumber(0)
            setSearchResults(keyword)
        }
    }

    useEffect(() => 
    {
        if(!firstRender.current)
        {
            firstRender.current = true
        }
    }, [])

    useEffect(() => 
    {
        if(firstRender.current)
        {
            if(currentState == 'search')
            {    
                setSearchResults(keyword)
            }
        }
    }, [currentPageNumber])

    const Home = () => 
    {
        setCurrentState('home')
        setCurrentPageNumber(1)
        setMovies()
    }

    const Recommend = () => 
    {
        if(currentRecommendedMovies.length >= 1)
        {
            setAllAdaptedMovies(currentRecommendedMovies.length)
            setCurrentState('recommend')
            setCurrentPageNumber(0)
            setRecommendedMovies([], 'fromIndex')
        }
    }

    return (
        <>        
            <header className = { styles.header }>
                <div className = { styles.title }>
                    Movie<span className = { styles.heart }>X</span>
                </div>
                <div className = { styles.keywordSearch }>
                    <input className = { styles.keywordInput } type = "text" placeholder = 'movie name' onChange = { (event) => { inputKeyword(event) } }/>
                    <button className = { styles.keywordButton } onClick = { () => { searchKeyword(keyword) } }>
                        <FaSearch className = { styles.headerIcon }/>
                    </button>
                </div>
                <div className = { styles.routes }>
                    <div className = { styles.routesContainer }>                        
                        <button className = { styles.home } onClick = { () => { Home() } }>
                            Home
                        </button>                        
                        <button className = { styles.recommend } onClick = { () => { Recommend() } }>
                            Recommended
                        </button>                        
                    </div>
                </div>
            </header>            
        </>
    )
}

export default Header