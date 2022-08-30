export default interface MovieModel {
    id: number,
    title?: string,
    original_title?: string
    overview?:  string,
    tagline?: string,
    poster_path?: string,
    backdrop_path?: string,
    release_date: string,
    budget?: number,
    revenue?: number,
    popularity?: number,
    vote_average?: number,
    vote_count?: number
}