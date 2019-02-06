import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserDetail } from'../models/userDetail';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./styles/login.component.scss']
})

export class LoginComponent implements OnInit {
    
    public userList: AngularFireList<any>;
    public formLogin: FormGroup;
    public userSignUp: any = {};
    public usersCollection: AngularFirestoreCollection<UserDetail>;
    public users: Observable<UserDetail[]>;
    
    user: UserDetail ={
        name: '',
        lastName: '',
        age: '',
        job: ''
    };

    validationMessages = {
      email: [
        { type: 'required', message: 'Email is required.' },
        { type: 'email', message: 'Email must be valid.' }
      ],
      password: [
        { type: 'required', message: 'Password is required.' }
      ]
    };

    constructor(
      public afAuth: AngularFireAuth,
      public firebase: AngularFireDatabase,
      private afs: AngularFirestore,
      public formBuilder: FormBuilder,
      public router: Router
      ) {
        this.userList = this.firebase.list('userDetails');
        this.formLogin = formBuilder.group({
          email: new FormControl('', Validators.compose([
            Validators.email,
            Validators.required
          ])),
          password: new FormControl('', Validators.required)}
        );
        this.usersCollection = afs.collection<UserDetail>('userdeatils');
        this.users = this.usersCollection.valueChanges();
      }

    ngOnInit() {}

    createUser(){
      
      return this.afAuth.auth.createUserWithEmailAndPassword( this.userSignUp.email, this.userSignUp.password )
      .then((userSignUp) => {
            var user = this.afAuth.auth.currentUser;
            var userId = user.uid;
            this.usersCollection.doc(userId).set(this.user);
      })
      .catch(error => console.log(error));
    }

    loginUser(){
      return this.afAuth.auth.signInWithEmailAndPassword(this.formLogin.get('email').value, this.formLogin.get('password').value)
      .then((userLogin) => {
        this.router.navigate(['/']);
      })
      .catch(error => console.log(error));
    }
}
