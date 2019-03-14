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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./styles/login.component.scss']
})
export class LoginComponent implements OnInit {
   
    public formLogin: FormGroup;
    public userSignUp: any = {};
    public usersCollection: AngularFirestoreCollection<UserDetail>;
    public users: Observable<UserDetail[]>;
    public userD: any = {};
    private ngUnsubscribe = new Subject();

    user: UserDetail ={
        id: '',
        name: '',
        lastName: '',
        email: '',
        admin: true
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
      this.authService.registerUser( this.user.email, this.userSignUp.password )
      .then(() => {
          let currentUser = this.afAuth.auth.currentUser;
          let userId = currentUser.uid;
          this.userDetailService.insertUserDetails(this.user, userId);
          this.indicatorService.insertUserIndicators(this.indicator, userId);
          this.router.navigate(['/']);
      })
      .catch(error => console.log(error));
    }

    loginUser() {
        this.authService.loginUser(this.formLogin.get('email').value, this.formLogin.get('password').value)
        .then(() => {
         let user = this.afAuth.auth.currentUser;
         let userId = user.uid;
         let userdetail = this.userDetailService.getUserDetailWithoutId(userId);
         userdetail.get().pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(user =>{
            this.userD = user.data();

            if(!this.userD.admin) {
              this.notificacion.showNotification('top', 'center', 'danger', 'times-circle','No puedes ingresar a esta pagina');
                this.authService.logoutUser()
                .then(() => {
                    this.router.navigate(['/login']);
              }).catch(error => console.log(error));
            } else {
              this.notificacion.showNotification('top', 'center', 'success', 'check-square','Has ingresado correctamente');
              this.router.navigate(['/']);
            }
          });
        })
        .catch(error => {
              if(error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                this.notificacion.showNotification('top', 'center', 'danger', 'times-circle','Correo o contraseña incorrectos');
                this.formLogin.reset();
              } else {
                console.log(error.code);
              }
        });
    }
}
