import { useEffect, useState, useRef } from 'react'
import { Html } from '@react-three/drei'
import { FaSearch } from 'react-icons/fa'
import styles from './RightSidebar.module.css'
import StateHandler from '@/utils/Statehandler'

const RightSidebar = () => 
{
    const genres = 
    [
        'Action', 'Adventure', 'Animation', 'Children', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir',
        'Horror', 'IMAX', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western', 'other'
    ]

    const firstRender = useRef(false)
    const [genre, setGenre] = useState('')
    const setSearchKeyword = StateHandler((state) => { return state.setSearchKeyword })
    const currentState = StateHandler((state) => { return state.currentState })
    const currentPageNumber = StateHandler((state) => { return state.currentPageNumber })
    const setCurrentState = StateHandler((state) => { return state.setCurrentState })
    const setCurrentPageNumber = StateHandler((state) => { return state.setCurrentPageNumber })
    const setGenredMovies = StateHandler((state) => { return state.setGenredMovies })

    const inputGenre = (event) => 
    {
        setGenre(event.target.value)
        setCurrentState('genre')
        setCurrentPageNumber(0)
    }

    const searchGenre = (genre) => 
    {
        if(genre.length >= 1)
        {
            setSearchKeyword(genre)
            setCurrentState('genre')
            setGenredMovies(genre)
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
        if(currentState == 'genre')
        {
            if(firstRender.current)
            {
                searchGenre(genre)
            }
        }
    }, [currentPageNumber])

    return (
        <>
            <div className = { styles.rightSidebar }>
                <div className = { styles.heading }>
                    <span>Genre Retrieve</span>
                </div>
                <div className = { styles.genres }>
                    {
                        genres.map((genre, index) => 
                        {
                            return (
                                <span key = { index } className = { styles.genre }>{genre}</span>
                            )
                        })
                    }
                </div>
                <div className = { styles.genreRetrieve }>
                    <input className = { styles.genreInput } type = "text" placeholder = 'genre name' onChange = { (event) => { inputGenre(event) } }/>
                    <button className = { styles.genreButton } onClick = { () => { searchGenre(genre) } }>
                        <FaSearch className = { styles.headerIcon }/>
                    </button>
                </div>
            </div>
        </>
    )
}

export default RightSidebar