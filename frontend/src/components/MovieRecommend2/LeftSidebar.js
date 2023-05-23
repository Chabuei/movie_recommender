import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import styles from './LeftSidebar.module.css'
import StateHandler from '@/utils/Statehandler.js'

const SelectedMovieCard = (props) => 
{
    const deleteUserLikes = StateHandler((state) => { return state.deleteUserLikes })
    
    return (
        <>
            <button className = { styles.selectedMovieCard }>
                <div className = { styles.movieTitle }>
                    <span className = { styles.subMovieTitle }>{ props.title.length >= 25 ? props.title.substr(0, 25) + '…' : props.title }</span>
                </div>                
                <button className = { styles.deleteButton } onClick = { () => { deleteUserLikes(props.title, props.index) } }>
                    <span>x</span>
                </button>
            </button>
        </>
    )
}

const LeftSidebar = () => 
{
    const [check, setCheck] = useState('error')
    const [currentUserLikes, setCurrentUserLikes] = useState([])
    const firstRender = useRef(false)
    const cardsContainerRef = useRef(null)
    const recommendStatus = StateHandler((state) => { return state.recommendStatus })
    const userLikes = StateHandler((state) => { return state.userLikes })
    const setCurrentState = StateHandler((state) => { return state.setCurrentState })
    const setCurrentPageNumber = StateHandler((state) => { return state.setCurrentPageNumber })
    const setRecommendedMovies = StateHandler((state) => { return state.setRecommendedMovies })
    const setRecommendStatus = StateHandler((state) => { return state.setRecommendStatus })
    const deleteAllUserLikes = StateHandler((state) => { return state.deleteAllUserLikes })

    const submit = async () => 
    {
        const arrayForRecommend = []

        setRecommendStatus('begin')
        recommendStatus

        currentUserLikes.map((currentUserLike) => 
        {
            arrayForRecommend.push(currentUserLike.id)
        })

        setCheck('okay')

        const recommendedMovies = await (await fetch(`https://xei7ax90q9.execute-api.us-east-1.amazonaws.com/prod/createrecommend?items=${arrayForRecommend}`)).json()
        
        setRecommendStatus('end')
        setCurrentState('recommend')
        setCurrentPageNumber(0)
        setRecommendedMovies(recommendedMovies, 'fromList')
    }

    const deleteAll = () => 
    {        
        deleteAllUserLikes()
    }

    useEffect(() => 
    {
        if(firstRender.current)
        {
            setCurrentUserLikes(userLikes)
            const timeline = gsap.timeline({})
            timeline.add(gsap.to(cardsContainerRef.current, { x: -10, duration: 0.25, opacity:0, ease: 'linear' }))
            timeline.add(gsap.to(cardsContainerRef.current, { x: 20, duration: 0 }))
            timeline.add(gsap.to(cardsContainerRef.current, { x: 0, opacity: 1, duration: 0.75, ease: 'expo.out' }))
        }
        else
        {
            firstRender.current = true
        }
    }, [userLikes])

    return (
        <> 
            <div className = { styles.leftSidebar }>
                <div className = { styles.subLeftSidebar }>                
                    <div className = { styles.numberOfSelectedMovies }>
                        <span className = { styles.currentFigure }>{currentUserLikes.length}/10</span>
                    </div>                                
                    <div className = { styles.operations }>                                
                        <button className = { styles.deleteAllButton } onClick = { () => { deleteAll() } }>
                            <span>Delete All</span>
                        </button>                                                                
                        <button className = { styles.recommendButton } onClick = { () => { submit() } }>
                            <span>Recommend</span>
                        </button>  
                    </div>                
                </div>
                <div className = { styles.selectedMovieCards } ref = { cardsContainerRef }>
                    {
                        currentUserLikes.map((currentUserLikes, index) => 
                        {
                            return (
                                <SelectedMovieCard key = { index } title = { currentUserLikes.title } index = { index }/>
                            )
                        })
                    }
                </div>
           </div>           
        </>
    )
}

export default LeftSidebar