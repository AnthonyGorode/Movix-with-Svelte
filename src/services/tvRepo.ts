import { db } from "../../firebase";
import { collection, doc, query, where, addDoc, getDocs, deleteDoc } from "firebase/firestore"; 

import type TvModel from './../models/tv.model';
import type FavoriteTvModel from '../models/favoriteTv.model';


const getTvs = async() => {
    try {
        const tvRef = collection(db, "tv");

        const querySnapshot = await getDocs(tvRef);

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

const getTvById = async(tv_id: number) => {
    try {
        const tvRef = collection(db, "tv");

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

const addTv = async(tv: TvModel) => {
    try {
        const docRef = await addDoc(collection(db, "tv"), tv);
        
        return docRef.id;
      } catch (error) {
        throw new Error("Error adding document: ", error);
      }
}

const deleteTv = async(doc_id: string) => {
    try {
       await deleteDoc(doc(db, "tv", doc_id));
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