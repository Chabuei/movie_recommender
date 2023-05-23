const router = require('express').Router()
const mysqlClient  = require('../database/client.js')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

router.get('/createrecommend', async (req, res) => 
{
    const userLikes = req.query.items.split(',')

    try
    {
        const response = await axios.get(`https://v78gfzxuyd.execute-api.us-east-1.amazonaws.com/prod/%7Bproxy+%7D?items=${userLikes}`, { headers: { "Content-type": "text/plain" }})
        const recommendedMovies = response.data
        
        if(recommendedMovies[0] !== 0)
        {
            const movies = await mysqlClient.executeQuery('SELECT `movie_id`, `title`, `rating`, `evaluations`, `image` FROM `movies` WHERE `movie_id` IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [...recommendedMovies])
            
            return res.status(200).json(movies)
        }
        else
        {
            const movies = []

            for(let i = 0 ; i < 10 ; i++)
            {
                if(!movies[i])
                {
                    movies.push({ movie_id: '', title: '', rating: '', evaluations: '', image: '' })
                }
            }

            return res.status(200).json(movies)
        }   
    }
    catch(error)
    {
        console.log(error)
        
        return res.status(500).json(error)
    }
})

router.get('/movies', cors(), async (req, res) => 
{
    try
    {
        const movies = await mysqlClient.executeQuery('SELECT `movie_id`, `title`, `rating`, `evaluations`, `image` FROM `movies` WHERE `evaluations` >= 100 ORDER BY rating DESC LIMIT 10 OFFSET ?', [parseInt(req.query.pagination)])
        const max = await mysqlClient.executeQuery('SELECT COUNT(*) FROM `movies` WHERE `evaluations` >= 100', [])

        movies.push(max)

        return res.status(200).json(movies)
    }
    catch(error)
    {
        console.log(error)

        return res.status(500).json(error)
    }
})

router.get('/movies/search', cors(), async (req, res) => 
{
    let counter = 0

    try
    {
        const max = await mysqlClient.executeQuery('SELECT COUNT(*) FROM `movies` WHERE `title` LIKE ' + `'%` + req.query.keyword + `%'` + ' AND `evaluations` >= 5', [])
        const movies = await mysqlClient.executeQuery('SELECT `movie_id`, `title`, `rating`, `evaluations`, `image` FROM `movies` WHERE `title` LIKE ' + `'%` + req.query.keyword + `%'` + ' AND `evaluations` >= 5 ORDER BY `rating` DESC LIMIT 10 OFFSET ' + req.query.pagination, [])
        if(max[0]['COUNT(*)'] > 0)
        {
            if(movies.length >= 1)
            {
                movies.map( async (movie, index) =>
                {                                        
                    counter++

                    if(counter >= movies.length)
                    {
                        if(counter >= 10)
                        {
                            movies.push(max[0])

                            return res.status(200).json(movies)
                        }
                        else
                        {
                            for(let i = 0 ; i < 10 ; i++)
                            {
                                if(!movies[i])
                                {
                                    movies.push({ movie_id: '', title: '', rating: '', evaluations: '', image: '' })
                                }
                            }

                            movies.push(max[0])
                        
                            return res.status(200).json(movies)
                        }
                    }
                })
            }
        }
        else
        {
            const movies = []
            
            for(let i = 0 ; i < 10 ; i++)
            {                            
                movies.push({ movie_id: '', title: '', rating: '', evaluations: '', image: '' })
            }

            movies.push(max[0])

            return res.status(200).json(movies)
        }
    }
        catch(error)
        {
            console.log(error)

            return res.status(500).json(error)
        }
})

router.get('/movies/genre', async (req, res) => 
{
    let counter = 0

    try
    {
        const max = await mysqlClient.executeQuery('SELECT COUNT(*) FROM `movies` WHERE `genre` LIKE ' + `'%` + req.query.genre + `%'` + ' AND `evaluations` >= 5', [])
        const movies = await mysqlClient.executeQuery('SELECT `movie_id`, `title`, `rating`, `evaluations`, `image` FROM `movies` WHERE `genre` LIKE ' + `'%` + req.query.genre + `%'` + ' AND `evaluations` >= 5 ORDER BY `rating` DESC LIMIT 10 OFFSET ' + req.query.pagination, [])
        
        if(max[0]['COUNT(*)'] > 0)
        {
            movies.map( async (movie, index) =>
            {                
                counter++

                if(counter >= movies.length)
                {
                    if(counter >= 10)
                    {
                        movies.push(max[0])

                        return res.status(200).json(movies)
                    }
                    else
                    {
                        for(let i = 0 ; i < 10 ; i++)
                        {
                            if(!movies[i])
                            {
                                movies.push({ movie_id: '', title: '', rating: '', evaluations: '', image: '' })
                            }
                        }

                        movies.push(max[0])
                    
                        return res.status(200).json(movies)
                    }
                }
            })
        }
        else
        {
            const movies = []
            
            for(let i = 0 ; i < 10 ; i++)
            {                            
                movies.push({ movie_id: '', title: '', rating: '', evaluations: '', image: '' })
            }

            movies.push(max[0])

            return res.status(200).json(movies)
        }
    }
    catch(error)
    {
        console.log(error)

        return res.status(500).json(error)
    }
})

module.exports = router