import { useEffect, useRef, useState, lazy } from 'react'
import { FaStar } from 'react-icons/fa'
import StateHandler from '@/utils/Statehandler.js'
import Image from 'next/image'
import styles from './Contents.module.css'

const Title = (props) => 
{
    return (
        <>
            { props.title.length >= 28 ? props.title.substr(0, 28) + '…' : props.title }
        </>
    )
}

const Rating = (props) => 
{
    return (
        <>
            { (Math.round(props.rating * 10) / 10).toFixed(1) }
        </>
    )
}

const Poster = (props) => 
{  
    if(props.image == '')
    {
        return (
            <>            
                <Image width={200} height={100} className = { styles.cardImage } src = { '/error.jpg' } alt = 'moviePoster' />                 
            </>                                               
        )    
    }
    else
    {
        return (
            <>            
                <Image width={200} height={100} className = { styles.cardImage } src = { props.image } alt = 'moviePoster' />                 
            </>                                               
        ) 
    }

    
}

const Contents = () => 
{
    let count =0
    const firstRender = useRef(false)

    const getCardInfo = (title, id) => 
    {
        setUserLikes(title, id)
    }

    const currentMovies = StateHandler((state) => { return state.currentMovies })
    const currentPageNumber = StateHandler((state) => { return state.currentPageNumber })
    const setUserLikes = StateHandler((state) => { return state.setUserLikes })
    const [moviesNow, setMoviesNow] = useState(currentMovies)

    useEffect(() => 
    {
        if(firstRender.current)
        {
            setMoviesNow(currentMovies)
        }
        else
        {
            firstRender.current = true
        }
    }, [currentPageNumber])

    return (
        <>  
            {
                currentMovies.map((_, index) => 
                {                    
                    count += 1

                    if(count <= 10)
                    {                        
                        return (
                            <div className = { styles.card } key = { index } onClick = { () => { getCardInfo(currentMovies[index].title, currentMovies[index].movie_id) } }>
                                <div className = { styles.cardHeader }>
                                    <FaStar className = { styles.cardIcon } />
                                    <Rating rating = { currentMovies[index] ? currentMovies[index].rating : 0.0 }/>    
                                </div>                
                                <div className = { styles.cardContents }>
                                    <Poster image = { currentMovies[index] ? currentMovies[index].image : '' }/>
                                </div>                                
                                <div className = { styles.cardFooter }>
                                    <div className = { styles.subCardFooter }>
                                        <Title title = { currentMovies[index] ? currentMovies[index].title : '' }/>
                                    </div>
                                </div>
                            </div>      
                        )
                    }                    
                })
            }                  
        </>
    )
}

export default Contents