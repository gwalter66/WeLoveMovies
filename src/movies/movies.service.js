const knex = require("../db/connection")

//list all movies
function list() {
    return knex("movies").select("*")
}

// get all movies where is_showing is true
function listIsShowing() {
    return knex('movies as m')
    .join('movies_theaters as mt', 'm.movie_id', 'mt.movie_id')
    .select('m.*')
    .where({ 'mt.is_showing': true })
    .groupBy('m.movie_id')
}

//get movie for specific movie_id
function read(movie_id) {
    return knex("movies").select("*").where({ movie_id }).first()
}

// list all movie theaters with movies 
function readMoviesTheaters() {
    return knex('movies_theaters as mt')
        .join("movies as m", "m.movie_id", "mt.movie_id")
        .join("theaters as t", "t.theater_id", "mt.theater_id")
        .select("t.*")
        .groupBy("t.theater_id")
}


// map the review content so critic information is in an object
function addCritic(movies) {
    return movies.map((movie) => {
        return {
            'review_id': movie.review_id,
            'content': movie.content,
            'score': movie.score,
            'created_at': movie.created_at,
            'updated_at': movie.updated_at,
            'critic_id': movie.critic_id,
            'movie_id': movie.movie_id,
            'critic': {
                'critic_id': movie.c_critic_id,
                'preferred_name': movie.preferred_name,
                'surname': movie.surname,
                'organization_name': movie.organization_name,
                'created_at': movie.c_created_at,
                'updated_at': movie.c_updated_at
            }
        }
    })
}

// list all movie reviews for a particular movieId with critic information
function listMovieReviews(movieId) {
    console.log(movieId)
    return knex('movies as m')
        .join('reviews as r', 'm.movie_id', 'r.movie_id')
        .join('critics as c', 'r.critic_id', 'c.critic_id')
        .select(
            'm.*',
            'r.*',
            'c.created_at as c_created_at',
            'c.updated_at as c_updated_at',
            'c.critic_id as c_critic_id',
            'c.preferred_name',
            'c.surname',
            'c.organization_name',
        )
        .where({'r.movie_id': movieId})
        .then(addCritic)
}

module.exports = {
    list,
    listIsShowing,
    read,
    readMoviesTheaters,
    listMovieReviews,
}