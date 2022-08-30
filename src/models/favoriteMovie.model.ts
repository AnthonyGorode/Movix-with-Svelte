import type MovieModel from './movie.model';

export default interface FavoriteMovieModel {
    documentId: string,
    movie: MovieModel
}