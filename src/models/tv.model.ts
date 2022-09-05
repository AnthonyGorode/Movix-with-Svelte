export default interface TvModel {
    id: number,
    name: string,
    original_name?: string,
    original_language?: string,
    first_air_date: string,
    overview?:  string,
    tagline?: string,
    poster_path?: string,
    backdrop_path?: string,
    number_of_seasons?: number,
    number_of_episodes?: number
    popularity?: number,
    vote_average?: number,
    vote_count?: number,
    in_production: boolean,
}