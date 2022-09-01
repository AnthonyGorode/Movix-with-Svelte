export default interface ActorModel {
    id: number,
    name: string,
    also_known_as: string[],
    birthday: string,
    deathday: string,
    place_of_birth: string,
    gender: number, // 1:female | 2:male
    biography: string,
    popularity: number,
    profile_path: string
}