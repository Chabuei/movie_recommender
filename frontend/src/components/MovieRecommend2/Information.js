import { useRef } from 'react'
import styles from './Information.module.css'
import StateHandler from '@/utils/Statehandler.js'

const Information = () => 
{
    const limit = 30
    const ref = useRef(null)
    const recommendStatus = StateHandler((state) => { return state.recommendStatus })
    const currentState = StateHandler((state) => { return state.currentState })
    const searchKeyword = StateHandler((state) => { return state.searchKeyword })
    const currentMovies = StateHandler((state) => { return state.currentMovies })

    const displayInformation = (state) => 
    {
        if(state == 'home')
        {
            if(recommendStatus == 'begin')
            {
                return 'Now creating recommendations for you...(It could take about 10 seconds for the first recommendations)'
            }

            return `Home(Please input at most 10 favorite movies and then click Recommend button!)`
        }

        if(state == 'search')
        {
            if(recommendStatus == 'begin')
            {
                return 'Now creating recommendations for you...(It could take about 10 seconds for the first recommendations)'
            }

            if(searchKeyword.length >= limit)
            {
                return `Results for the keyword '${searchKeyword.substr(0, limit)}'`
            }
            else
            {
                return `Results for the keyword '${searchKeyword}'`
            }
        }

        if(state == 'genre')
        {
            if(recommendStatus == 'begin')
            {
                return 'Now creating recommendations for you...(It could take about 10 seconds for the first recommendations)'
            }

            if(searchKeyword.length >= limit)
            {
                return `Results for the genre '${searchKeyword.substr(0, limit)}'`
            }
            else
            {
                return `Results for the genre '${searchKeyword}'`
            }
            
        }

        if(state == 'recommend')
        {
            if(recommendStatus == 'begin')
            {
                return 'Now creating recommendations for you...(It could take about 10 seconds for the first recommendations)'
            }

            if(currentMovies[0].movie_id !== '')
            {
                return 'Recommendations for you!'
            }
            else
            {
                return 'We couldn`t make recommendations because of lack of data... Please try other movies'
            }
        }
    }
    
    return (
        <>
            <div className = { styles.information }>
                <span className = { styles.subInformation } ref = { ref }>
                    { displayInformation(currentState) }
                </span>
            </div>                
        </>
    )
}

export default Information