import { useEffect, useRef } from 'react'
import StateHandler from '@/utils/Statehandler.js'
import Header from '@/components/MovieRecommend2/Header.js'
import LeftSidebar from '@/components/MovieRecommend2/LeftSidebar.js'
import RightSidebar from '@/components/MovieRecommend2/RightSidebar.js'
import Interface from '@/components/MovieRecommend2/Interface.js'

export async function getServerSideProps()
{
  try
  {
    const movies = await (await fetch(`https://xei7ax90q9.execute-api.us-east-1.amazonaws.com/prod/movies?pagination=${0}`)).json()
    
    return { props: { movies } }
  }
  catch(error)
  {
    const movies = []
                
    for(let i = 0 ; i < 10; i++)
    {
        movies.push({movie_id: '', title: '', rating: '', evaluations: '', image: ''})

        if(i == 9)
        {
            movies.push([{'COUNT(*)': 10}])

            return { props: { movies } }
        }
    }
  }
}

const App = ({ movies }) => 
{
  const firstRender = useRef(false)
  const initMovies = StateHandler((state) => { return state.initMovies })

  useEffect(() => 
  {
    if(!firstRender.current)
    {
      initMovies(movies)

      firstRender.current = true
    }
  }, [])

  return (
    <>
      <div className = 'canvas'>
        <div className = 'header'>
          <Header/>        
        </div>
        <div className = 'main'>
          <div className = 'leftSidebar'>
            <div className = 'subLeftSidebar'><LeftSidebar/></div>
          </div>
          <div className = 'center'>
            <div className = 'subCenter'><Interface movies = { movies }/></div>
          </div>
          <div className = 'rightSidebar'>
            <div className = 'subRightSidebar'><RightSidebar/></div>
          </div>          
        </div>
      </div>
    </>
  )
}

export default App