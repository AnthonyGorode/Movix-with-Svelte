import { auth, db } from '../../firebase';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, addDoc, collection } from "firebase/firestore";


const userDoc = (userId) => doc(db, "users", userId);

const signIn = async(email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error.message);
        if(error.message == "Firebase: Error (auth/wrong-password).") {
            throw Error("Le mot de passe saisi est incorrect.", error);
        } 
        else if(error.message == "Firebase: Error (auth/user-not-found).") {
            throw Error("L'email saisi est incorrect.", error);
        }
        else if(error.message == "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
            throw Error("L'accès à ce compte est temporairement indisponible dû à de nombreuses tentatives de connexion infructueuses .", error);
        }
        else {
            throw Error("Une erreur c'est produite, réessayer plus tard.", error);
        }
    }
}

const signUp = async(lastName: string, firstName: string, email: string, password: string) => {
    const username = firstName + " " + lastName;
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user.user, { displayName: username });

        await createUser(lastName, firstName, email);

        return user;
    } catch (error) {
        throw Error("Une erreur c'est produite, réessayer plus tard.", error);
    }
}

const logOut = async() => {
    try {
        await signOut(auth);
    } catch (error) {
        throw Error("Une erreur c'est produite, réessayer plus tard.", error);
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
        throw Error("Une erreur c'est produite, réessayer plus tard.", error);
    }
}

export {
    signIn,
    signUp,
    logOut
};