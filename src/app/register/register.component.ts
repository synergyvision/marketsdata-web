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

    indicator: Indicator = {
      id: '',
      indicator1: {name: 'Earning Yield', enable: true, value: 'earningYield'},
      indicator2: {name: 'Price to Earnings', enable: true, value: 'peRatio'},
      indicator3: {name: 'Return on Equity', enable: true, value:'returnOnEquity'},
      indicator4: {name: 'Return on Assets', enable: true, value: 'returnOnAssets'},
      indicator5: {name: 'Week 52 High', enable: true, value: 'week52high'},
      indicator6: {name: 'Week 52 low', enable: true, value: 'week52low'},
      indicator7: {name: 'Week 52 change', enable: true, value: 'week52change'},
      indicator8: {name: 'Dividend Rate', enable: true, value: 'dividendRate'},
      indicator9: {name: 'Dividend Yield', enable: true, value: 'dividendYield'},
      indicator10: {name: 'Float', enable: true, value: 'float'},
      indicator11: {name: 'Profit Margin', enable: true, value: 'profitMargin'},
      indicator12: {name: 'Price to sales', enable: true, value: 'priceToSales'},
      indicator13: {name: 'Price to book', enable: true, value: 'priceToBook'},
      indicator14: {name: 'Institution Percent', enable: true, value: 'institutionPercent'},
      indicator15: {name: 'Year 5 change percent', enable: true, value: 'year5ChangePercent'}
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
          this.notificacion.showNotification('top', 'center', 'success', 'check-square','Usuario creado con exito');
          this.router.navigate(['/']);
      })
      .catch(error => {
        if(error.code == 'auth/email-already-in-use'){
          this.notificacion.showNotification('top', 'center', 'danger', 'times-circle','Ya existe un usuario con ese correo');
        }
      });
    }
}
