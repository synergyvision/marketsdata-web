import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserDetail } from'../models/userDetail';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserdetailService } from '../services/userdetail.service';
import { Indicator } from '../models/indicator';
import { IndicatorsService } from '../services/indicators.service';

import { NotificationsPageComponent } from '../utils';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./styles/register.component.scss']
})
export class RegisterComponent implements OnInit {
   
    public form: FormGroup;
    public userSignUp: any = {};
    public usersCollection: AngularFirestoreCollection<UserDetail>;
    public users: Observable<UserDetail[]>;
    public userD: any = {};

    user: UserDetail = {
        id: '',
        name: '',
        lastName: '',
        email: '',
        admin: false
    };

    indicator: Indicator ={
      id: '',
      indicator1: {name: 'Earning Yield', enable: true, value: 'earningYield'},
      indicator2: {name: 'Price to Earnings', enable: true, value: 'peRatio'},
      indicator3: {name: 'Return on Equity', enable: true, value:'returnOnEquity'},
      indicator4: {name: 'Return on Assets', enable: true, value: 'returnOnAssets'},
      //indicator5: {name: 'Return on Capital', enable: true},
    }

    validationMessages = {
      email: [
        { type: 'required', message: 'El correo es obligatorio.' },
        { type: 'email', message: 'El correo debe ser válido.' }
      ],
      password: [
        { type: 'required', message: 'La contraseña es obligatoria' }
      ],
      name: [
        { type: 'required', message: 'El nombre es obligatorio' }
      ],
      lastName: [
        { type: 'required', message: 'El apellido es obligatorio' }
      ]
    };

    constructor(
      public notificacion: NotificationsPageComponent,
      public indicatorService: IndicatorsService,
      public userDetailService: UserdetailService,
      public afAuth: AngularFireAuth,
      public afs: AngularFirestore,
      public formBuilder: FormBuilder,
      private authService: AuthService,
      public router: Router
      ) {
        this.form = formBuilder.group({
          email: new FormControl('', Validators.compose([
            Validators.email,
            Validators.required
          ])),
          password: new FormControl('', Validators.required),
          name: new FormControl('', Validators.required),
          lastName: new FormControl('', Validators.required)
        });
        this.usersCollection = afs.collection<UserDetail>('userdeatils');
        this.users = this.usersCollection.valueChanges();
      }

    ngOnInit() {}

    createUser(){
      this.authService.registerUser( this.form.value.email, this.form.value.password )
      .then(() => {
          let currentUser = this.afAuth.auth.currentUser;
          let userId = currentUser.uid;
          this.user.email = this.form.value.email;
          this.user.name = this.form.value.name;
          this.user.lastName = this.form.value.lastName;
          this.userDetailService.insertUserDetails(this.user, userId);
          this.indicatorService.insertUserIndicators(this.indicator, userId);
          this.router.navigate(['/']);
      })
      .catch(error => console.log(error));
    }
}
