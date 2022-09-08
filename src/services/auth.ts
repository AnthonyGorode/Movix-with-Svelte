import { auth, db } from '../../firebase';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, addDoc, collection } from "firebase/firestore";


const userDoc = (userId) => doc(db, "users", userId);

const signIn = async(email: string, password: string) => {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw Error("Une erreur c'est produite => ", error);
    }
}

const signUp = async(lastName: string, firstName: string, email: string, password: string) => {
    const username = firstName + " " + lastName;
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user.user, { displayName: username });

        await createUser(lastName, firstName, email);

        console.log("User Created => ",user);
        return user;
    } catch (error) {
        throw Error("Une erreur c'est produite => ", error);
    }
}

const logOut = async() => {
    try {
        await signOut(auth);
    } catch (error) {
        throw Error("Une erreur c'est produite => ", error);
    }
}

const createUser = async(lastName: string, firstName: string, email: string) => {
    try {
        await setDoc(userDoc(auth.currentUser.uid), {
            lastName,
            firstName,
            email
        });
       
    } catch (error) {
        throw Error("Une erreur c'est produite => ", error);
    }
}

const testSubCollection = async() => {
    try {     
        const movieCollection = collection(db, "users", "kpyG2wthS81dCOk7nXet", "movie");
        await addDoc(movieCollection, {id: 616037, title: "Thor : Love and Thunder"});
    } catch (error) {
        throw Error("Une erreur c'est produite => ", error);
    }
}

export {
    signIn,
    signUp,
    logOut
};