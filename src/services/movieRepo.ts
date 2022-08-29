import type { MovieModel } from './../models/movie.model';
import { db } from "../../firebase";

import { collection, doc, query, where, addDoc, getDocs, deleteDoc } from "firebase/firestore"; 


const addMovie = async(movie: MovieModel) => {
    try {
        const docRef = await addDoc(collection(db, "movie"), movie);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
      } catch (error) {
        throw new Error("Error adding document: ", error);
      }
    //   const test = [{"lol": {nom: "toto", prenom: "tata"}}]
}


const getMovieById = async(movie_id: number) => {
    try {
        const movieRef = collection(db, "movie");

        const q = query(movieRef, where("movie_id", "==", movie_id));
        const querySnapshot = await getDocs(q);

        let docId: string;
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());

            docId = doc.id
        });

        return docId;
    } catch (error) {
        console.error("Error getting document: ", error);
        
    }
}


const deleteMovie = async(doc_id: string) => {
    try {
       await deleteDoc(doc(db, "movie", doc_id));
    } catch (error) {
        console.error("Error deleting document: ", error);
        
    }
}

export {
    addMovie,
    getMovieById,
    deleteMovie
};