import type ActorModel from "./actor.model";

export default interface FavoriteActorModel {
    documentId: string,
    actor: ActorModel
}