import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./styles/login.component.scss']
})

export class LoginComponent implements OnInit {
    user: any = {};
    constructor(public afAuth: AngularFireAuth) {}

    ngOnInit() {}

    createUser(){
      return this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then((user) => {
        console.log("Usuario registrado");
      })
      .catch(error => console.log(error));
    }
}
