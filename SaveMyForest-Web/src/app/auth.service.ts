import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private auth: AngularFireAuth) { }

    signIn(email: string, password: string): Promise<User> {
        return this.auth.signInWithEmailAndPassword(email, password).then(value => {
            return {
                uid: value.user?.uid,
                email: value.user?.email
            } as User;
        });
    }

    signUp(invitationCode: string, username: string, email: string, password: string, phoneNumber: string): Promise<UserCredential> {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    isAuthenticated(): boolean {
        console.log(this.auth.currentUser);
        return this.auth.currentUser != null;
    }
}

export interface User {
    uid: string;
    email: string;
}