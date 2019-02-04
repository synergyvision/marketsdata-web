import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./styles/login.component.scss']
})

export class LoginComponent implements OnInit {
    userSignUp: any = {};
    userLogin: any = {};

    constructor(public afAuth: AngularFireAuth,
      public router: Router) {}

    ngOnInit() {}

    createUser(){
      return this.afAuth.auth.createUserWithEmailAndPassword( this.userSignUp.email, this.userSignUp.password )
      .then((userSignUp) => {
        console.log('Usuario registrado');
      })
      .catch(error => console.log(error));
    }

    loginUser(){
      return this.afAuth.auth.signInWithEmailAndPassword(this.userLogin.email, this.userLogin.password)
      .then((userLogin) => {
        this.router.navigate(['/']);
      })
      .catch(error => console.log(error));
    }
}
