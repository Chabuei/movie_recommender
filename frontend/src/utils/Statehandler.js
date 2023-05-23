import { create } from 'zustand'

const StateHandler = create((set, get) => 
{
    return {
        allAdaptedMovies: 0,
        currentState: 'home',
        currentPageNumber: 0,
        currentLeftTrigger: 0,
        currentRightTrigger: 0,
        currentMovies : [],
        userLikes: [],
        currentRecommendedMovies: [],
        currentSearchResults: [],
        searchKeyword: '',
        recommendStatus: 'nothing',

        setRecommendStatus: (inputState) => 
        {
            set(() => 
            {
                return { recommendStatus: inputState }
            })
        },

        setSearchKeyword: (keyword) => 
        {            
            set(() => 
            {
                return { searchKeyword: keyword }
            })
        },

        setCurrentState: (state) => 
        {
            set(() => 
            {
                return { currentState: state }
            })
        },

        setAllAdaptedMovies: (number) => 
        {
            set(() => 
            {
                return { allAdaptedMovies: number }
            })
        },

        setCurrentPageNumber: (number) => 
        {
            set(() => 
            {
                return { currentPageNumber: number }
            })
        },

        incrementPageNumber: () => 
        {
            const currentState = get().currentState

            if(currentState == 'home')
            {
                set((state) => 
                {
                    if(state.currentPageNumber + 10 >= get().currentMovies[10][0]['COUNT(*)'] )
                    {
                        return { currentPageNumber: state.currentPageNumber }
                    }
                    else
                    {                    
                        const nextPageNumber = state.currentPageNumber + 10
                        const nextRightTrigger = state.currentRightTrigger + 1
                        
                        return { currentPageNumber: nextPageNumber, currentRightTrigger: nextRightTrigger }
                    }
                })
            }
            
            if(currentState == 'recommend')
            {
                set((state) => 
                {
                    if(state.currentPageNumber + 10 >= state.currentRecommendedMovies.length)
                    {
                        return { currentPageNumber: state.currentPageNumber }
                    }
                    else
                    {
                        const nextPageNumber = state.currentPageNumber + 10
                        const nextRightTrigger = state.currentRightTrigger + 1
                        
                        return { currentPageNumber: nextPageNumber, currentRightTrigger: nextRightTrigger }
                    }
                })
            }

            if(currentState == 'search' || currentState == 'genre')
            {
                set((state) => 
                {
                    if(state.currentPageNumber + 10 >= get().currentMovies[10]['COUNT(*)'])
                    {
                        return { currentPageNumber: state.currentPageNumber }
                    }
                    else
                    {
                        const nextPageNumber = state.currentPageNumber + 10
                        const nextRightTrigger = state.currentRightTrigger + 1
                        
                        return { currentPageNumber: nextPageNumber, currentRightTrigger: nextRightTrigger }
                    }
                })
            }
        },

        decrementPageNumber: () => 
        {
            const currentState = get().currentState

            if(currentState == 'home')
            {
                set((state) => 
                {
                    if(state.currentPageNumber <= 1)
                    {
                        return { currentPageNumber: state.currentPageNumber }
                    }
                    else
                    {
                        const nextPageNumber = state.currentPageNumber - 10
                        const nextLeftTrigger = state.currentLeftTrigger + 1

                        return { currentPageNumber: nextPageNumber, currentLeftTrigger: nextLeftTrigger }
                    }
                })
            }

            if(currentState == 'recommend' || currentState == 'search' || currentState == 'genre')
            {
                set((state) => 
                {
                    if(state.currentPageNumber <= 0 )
                    {
                        return { currentPageNumber: state.currentPageNumber }
                    }
                    else
                    {
                        const nextPageNumber = state.currentPageNumber - 10
                        const nextLeftTrigger = state.currentLeftTrigger + 1

                        return { currentPageNumber: nextPageNumber, currentLeftTrigger: nextLeftTrigger }
                    }
                })
            }
        },

        initMovies: (movies) => 
        {
            set(() => 
            {
                return { currentMovies: [...movies] , allAdaptedMovies: movies[10][0]['COUNT(*)']}
            })
        },

        setMovies: async () => 
        {   
            const currentState = get().currentState

            if(currentState == 'home')
            {
                try
                {
                    const nextMovies = await (await fetch(`https://xei7ax90q9.execute-api.us-east-1.amazonaws.com/prod/movies?pagination=${parseInt(get().currentPageNumber)}`)).json()
                
                    set(() => 
                    {                                                
                        return { currentMovies: [...nextMovies], allAdaptedMovies: nextMovies[10][0]['COUNT(*)'] }
                    })
                } 
                catch(error)
                {
                    const nextMovies = []
                    for(let i = 0 ; i < 10; i++)
                    {
                        nextMovies.push({movie_id: '', title: '', rating: '', evaluations: '', image: ''})

                        if(i == 9)
                        {
                            nextMovies.push([{'COUNT(*)': 10}])

                            set(() => 
                            {                                                                
                                return { currentMovies: [...nextMovies], allAdaptedMovies: nextMovies[10][0]['COUNT(*)'] }
                            })
                        }
                    }
                }     
            }

            if(currentState == 'recommend')
            {
                set((state) => 
                {
                    const nextMovies = state.currentRecommendedMovies.slice(state.currentPageNumber, state.currentPageNumber + 10)
                    
                    return { currentMovies: [...nextMovies] }
                })
            }
        },

        setSearchResults: async (keyword) => 
        {
            try
            {
                const nextSearchResults = await (await fetch(`https://xei7ax90q9.execute-api.us-east-1.amazonaws.com/prod/movies/search?keyword=${keyword}&pagination=${get().currentPageNumber}`)).json()
                
                set(() => 
                {
                    return { currentMovies: [...nextSearchResults], allAdaptedMovies: nextSearchResults[10]['COUNT(*)'] }
                })
            }
            catch(error)
            {
                const nextMovies = []
                
                for(let i = 0 ; i < 10; i++)
                {
                    nextMovies.push({movie_id: '', title: '', rating: '', evaluations: '', image: ''})

                    if(i == 9)
                    {
                        nextMovies.push([{'COUNT(*)': 10}])

                        set(() => 
                        {                            
                            return { currentMovies: [...nextMovies], allAdaptedMovies: nextMovies[10][0]['COUNT(*)'] }
                        })
                    }
                }
            }
        },

        setGenredMovies: async (genre) => 
        {
            try
            {
                const nextSearchResults = await (await fetch(`https://xei7ax90q9.execute-api.us-east-1.amazonaws.com/prod/movies/genre?genre=${genre}&pagination=${get().currentPageNumber}`)).json()
                
                set(() => 
                {
                    return { currentMovies: [...nextSearchResults], allAdaptedMovies: nextSearchResults[10]['COUNT(*)']}
                })
            }
            catch(error)
            {
                const nextMovies = []
                
                for(let i = 0 ; i < 10; i++)
                {
                    nextMovies.push({movie_id: '', title: '', rating: '', evaluations: '', image: ''})

                    if(i == 9)
                    {
                        nextMovies.push([{'COUNT(*)': 10}])

                        set(() => 
                        {                                                
                            return { currentMovies: [...nextMovies], allAdaptedMovies: nextMovies[10][0]['COUNT(*)'] }
                        })
                    }
                }
            }
        },

        setRecommendedMovies: (recommendedMovies, from) => 
        {
            if(from == 'fromList')
            {
                let currentRecommendedMovies = get().currentRecommendedMovies
                            
                currentRecommendedMovies = [...recommendedMovies, ...currentRecommendedMovies]

                set(() => 
                {
                    return { currentMovies: [...recommendedMovies], currentRecommendedMovies: [...currentRecommendedMovies], allAdaptedMovies: currentRecommendedMovies.length }
                })
            }

            if(from == 'fromIndex')
            {
                const currentMovies = get().currentRecommendedMovies

                set(() => 
                {
                    return { currentMovies: [...currentMovies] }
                })
            }
        },

        setUserLikes: (title, id) => 
        {
            const currentUserLikes = get().userLikes

            if(currentUserLikes.length >= 10)
            {                
                return 
            }
            
            set((state) => 
            {
                const userLikeObject = { 'id': id, 'title': title }

                currentUserLikes.push(userLikeObject)    

                return { userLikes: [...currentUserLikes] }
            })
        },

        deleteUserLikes: (_, movieIndex) => 
        {
            const currentUserLikes = get().userLikes
            const nextUserLikes = []
            
            currentUserLikes.map((_, index) => 
            {
                if(movieIndex != index)
                {
                    nextUserLikes.push(currentUserLikes[index])
                }
            })

            set(() => 
            {
                return { userLikes: [...nextUserLikes] }
            })
        },

        deleteAllUserLikes: () => 
        {
            set(() => 
            {
                return { userLikes: [] }
            })
        }
    }
})

export default StateHandler