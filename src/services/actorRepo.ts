import { db } from "../../firebase";
import { collection, doc, query, where, addDoc, getDocs, deleteDoc, QuerySnapshot, type DocumentData } from "firebase/firestore"; 

import type ActorModel from './../models/actor.model';
import type FavoriteActorModel from '../models/favoriteActor.model';

const getActors = async(uid: string = "") => {
    try {
        let actorRef;
        if(uid) actorRef = collection(db, "users", uid, "actor");
        else actorRef = collection(db, "actor");

        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(actorRef);

        let arrFavorites: FavoriteActorModel[] = [];
        let actor: ActorModel;
        querySnapshot.forEach((doc) => {
            const { 
                id, name, also_known_as, birthday, deathday, place_of_birth, gender, biography, popularity, profile_path
            } = doc.data();
            actor = { 
                id, name, also_known_as, birthday, deathday, place_of_birth, gender, biography, popularity, profile_path
            };

            arrFavorites.push({ documentId: doc.id, actor });
        });

        return arrFavorites;
        
    } catch (error) {
        throw new Error("Error getting documents: ", error);
    }
}

const getActorById = async(actor_id: number, uid: string = "") => {
    try {
        let actorRef;
        if(uid) actorRef = collection(db, "users", uid, "actor");
        else actorRef = collection(db, "actor");

        const q = query(actorRef, where("id", "==", actor_id));
        const querySnapshot = await getDocs(q);

        let docId: string;
        querySnapshot.forEach((doc) => {
            docId = doc.id
        });

        return docId;
    } catch (error) {
        throw new Error("Error getting document: ", error);       
    }
}

const addActor = async(actor: ActorModel, uid: string = "") => {
    try {
        let docRef;
        if(uid) docRef = await addDoc(collection(db, "users", uid, "actor"), actor);
        else docRef = await addDoc(collection(db, "actor"), actor);
        
        return docRef.id;
      } catch (error) {
        throw new Error("Error adding document: ", error);
      }
}

const deleteActor = async(doc_id: string, uid: string = "") => {
    try {
        if(uid) await deleteDoc(doc(db, "users", uid, "actor", doc_id));
        else await deleteDoc(doc(db, "actor", doc_id));
    } catch (error) {
        throw new Error("Error deleting document: ", error);
        
    }
}

export {
    getActors,
    getActorById,
    addActor,
    deleteActor
};