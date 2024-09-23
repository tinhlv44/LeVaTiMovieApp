import axios from "axios"
import { apiKey } from "../constants"

const apiBaseUrl = 'https://api.themoviedb.org/3'

//endpoint
const trendingMoviesEndPoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`
const upcomingMoviesEndPoint = `${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`
const topratedMoviesEndPoint = `${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`

const searchMoviesEndpoint = `${apiBaseUrl}/search/movie?api_key=${apiKey}`
//dynamic endpoints
const movieDetailsEndpoint = id =>  `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`
const movieCreditsEndpoint = id =>  `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}`
const similarMoviesEndpoint = id =>  `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}`

const personDetailsEndpoint = id =>  `${apiBaseUrl}/person/${id}?api_key=${apiKey}`
const personMoviesEndpoint = id =>  `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}`


//fallcallImage
export const fallcallImageMovie = 'https://th.bing.com/th/id/OIP.CXEc0Us30dFcEl8V0uLJEgHaLH?rs=1&pid=ImgDetMain'
export const fallcallImageCast = 'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg'


export const img500 = path => path ? `https://image.tmdb.org/t/p/w500${path}` : null
export const img342 = path => path ? `https://image.tmdb.org/t/p/w342${path}` : null
export const img185 = path => path ? `https://image.tmdb.org/t/p/w185${path}` : null

const apiCall = async (endpoint, params) => {
    const options = {
        methord: 'GET',
        url: endpoint,
        params: params? params: {}
    }

    try{
        const reponse = await axios.request(options)
        return reponse.data
    }
    catch(err){
        console.log(err)
        return {}
    }
}

export const fetchTrenddingMovies = () =>{
    return apiCall(trendingMoviesEndPoint)
}
export const fetchUpcomingMovies = () =>{
    return apiCall(upcomingMoviesEndPoint)
}
export const fetchTopRatedMovies = () =>{
    return apiCall(topratedMoviesEndPoint)
}

export const fetchMovieDetails = id =>{
    return apiCall(movieDetailsEndpoint(id))
}
export const fetchMovieCredits = id =>{
    return apiCall(movieCreditsEndpoint(id))
}
export const fetchSimilarMovies = id =>{
    return apiCall(similarMoviesEndpoint(id))
}
export const fetchPersonDetails = id =>{
    return apiCall(personDetailsEndpoint(id))
}
export const fetchPersonMovies = id =>{
    return apiCall(personMoviesEndpoint(id))
}
export const fetchSearchMovies = params =>{
    return apiCall(searchMoviesEndpoint, params)
}