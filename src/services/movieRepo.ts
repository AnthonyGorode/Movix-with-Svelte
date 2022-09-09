import { db } from "../../firebase";
import { collection, doc, query, where, addDoc, getDocs, deleteDoc, QuerySnapshot, type DocumentData } from "firebase/firestore"; 

import type MovieModel from './../models/movie.model';
import type FavoriteMovieModel from '../models/favoriteMovie.model';


const getMovies = async(uid: string = "") => {
    try {
        let movieRef;
        if(uid) movieRef = collection(db, "users", uid, "movie");
        else movieRef = collection(db, "movie");

        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(movieRef);

        let arrFavorites: FavoriteMovieModel[] = [];
        let movie: MovieModel;
        querySnapshot.forEach((doc) => {
            const { 
                id, title, original_title, overview, tagline, poster_path, backdrop_path, release_date, budget, revenue, popularity, vote_average, vote_count
            } = doc.data();
            movie = { 
                id, title, original_title, overview, tagline, poster_path, backdrop_path, release_date, budget, revenue, popularity, vote_average, vote_count
            };

            arrFavorites.push({ documentId: doc.id, movie });
        });

        return arrFavorites;
        
    } catch (error) {
        throw new Error("Error getting documents: ", error);
    }
}

const getMovieById = async(movie_id: number, uid: string = "") => {
    try {
        let movieRef;
        if(uid) movieRef = collection(db, "users", uid, "movie");
        else movieRef = collection(db, "movie");

        const q = query(movieRef, where("id", "==", movie_id));
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

const addMovie = async(movie: MovieModel, uid: string = "") => {
    try {
        let docRef;
        if(uid) docRef = await addDoc(collection(db, "users", uid, "movie"), movie);
        else docRef = await addDoc(collection(db, "movie"), movie);
        
        return docRef.id;
      } catch (error) {
        throw new Error("Error adding document: ", error);
      }
}

const deleteMovie = async(doc_id: string, uid: string = "") => {
    try {
        if(uid) await deleteDoc(doc(db, "users", uid, "movie", doc_id));
       else await deleteDoc(doc(db, "movie", doc_id));
    } catch (error) {
        throw new Error("Error deleting document: ", error);
        
    }
}

export {
    getMovies,
    getMovieById,
    addMovie,
    deleteMovie
};