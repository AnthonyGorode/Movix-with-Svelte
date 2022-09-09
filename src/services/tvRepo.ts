import { db } from "../../firebase";
import { collection, doc, query, where, addDoc, getDocs, deleteDoc, QuerySnapshot, type DocumentData } from "firebase/firestore"; 

import type TvModel from './../models/tv.model';
import type FavoriteTvModel from '../models/favoriteTv.model';


const getTvs = async(uid: string = "") => {
    try {
        let tvRef;
        if(uid) tvRef = collection(db, "users", uid, "tv");
        else tvRef = collection(db, "tv");

        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(tvRef);

        let arrFavorites: FavoriteTvModel[] = [];
        let tv: TvModel;
        querySnapshot.forEach((doc) => {
            const { 
                id, name, original_name, original_language, first_air_date, overview, tagline, poster_path, backdrop_path, number_of_seasons, number_of_episodes, popularity, vote_average, vote_count, in_production
            } = doc.data();
            tv = { 
                id, name, original_name, original_language, first_air_date, overview, tagline, poster_path, backdrop_path, number_of_seasons, number_of_episodes, popularity, vote_average, vote_count, in_production
            };

            arrFavorites.push({ documentId: doc.id, tv });
        });

        return arrFavorites;
        
    } catch (error) {
        throw new Error("Error getting documents: ", error);
    }
}

const getTvById = async(tv_id: number, uid: string = "") => {
    try {
        let tvRef;
        if(uid) tvRef = collection(db, "users", uid, "tv");
        else tvRef = collection(db, "tv");

        const q = query(tvRef, where("id", "==", tv_id));
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

const addTv = async(tv: TvModel, uid: string = "") => {
    try {
        let docRef;
        if(uid) docRef = await addDoc(collection(db, "users", uid, "tv"), tv);
        else docRef = await addDoc(collection(db, "tv"), tv);
        
        return docRef.id;
      } catch (error) {
        throw new Error("Error adding document: ", error);
      }
}

const deleteTv = async(doc_id: string, uid: string = "") => {
    try {
        if(uid) await deleteDoc(doc(db, "users", uid, "tv", doc_id));
        else await deleteDoc(doc(db, "tv", doc_id));
    } catch (error) {
        throw new Error("Error deleting document: ", error);
        
    }
}

export {
    getTvs,
    getTvById,
    addTv,
    deleteTv
};