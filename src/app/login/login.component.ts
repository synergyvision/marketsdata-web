import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserDetail } from'../models/userDetail';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserdetailService } from '../services/userdetail.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./styles/login.component.scss']
})
export class LoginComponent implements OnInit {
    
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
      public userDetailService: UserdetailService,
      public afAuth: AngularFireAuth,
      public afs: AngularFirestore,
      public formBuilder: FormBuilder,
      private authService: AuthService,
      public router: Router
      ) {
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
      this.authService.registerUser( this.userSignUp.email, this.userSignUp.password )
      .then(() => {
            
            this.userDetailService.insertUserDetails(this.user);
            this.router.navigate(['/']);
      })
      .catch(error => console.log(error));
    }

    loginUser(){
        this.authService.loginUser(this.formLogin.get('email').value, this.formLogin.get('password').value)
        .then(() => {
            this.router.navigate(['/']);
        })
        .catch(error => console.log(error));
    }
}
