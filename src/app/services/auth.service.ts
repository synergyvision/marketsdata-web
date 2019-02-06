import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth
    ) {}

  registerUser(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
          
      })
      .catch(error => console.log(error));
  }

  loginUser(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(() => {
        
    })
    .catch(error => console.log(error));
  }

  logoutUser() {
    return this.afAuth.auth.signOut()
    .then(() => {
        
    })
    .catch(error => console.log(error));
  }
}
