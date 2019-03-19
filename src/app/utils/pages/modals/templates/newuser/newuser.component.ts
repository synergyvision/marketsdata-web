import { Component, ViewEncapsulation, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserdetailService } from '../../../../../services/userdetail.service';
import { NotificationsPageComponent } from '../../../notifications/notifications.page.component';
import { User } from '../../../../../models/user';
import { Indicator } from '../../../../../models/indicator';
import { IndicatorsService } from '../../../../../services/indicators.service';

@Component({
  selector: 'app-modal-newuser',
  templateUrl: 'newuser.component.html',
  styleUrls: ['./styles/newuser.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewUserComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject();
  form: FormGroup;
  user: any ={};
  userDetails: any ={};
  indicator: Indicator ={
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
  
  constructor(public dialogRef: MatDialogRef<NewUserComponent>,
    private formBuilder: FormBuilder,
    public userdetailservice: UserdetailService,
    public notificacion: NotificationsPageComponent,
    public indicatorService: IndicatorsService,
      public userDetailService: UserdetailService,
  ) {
    this.form = formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.email,
          Validators.required
        ])),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        name: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        admin: new FormControl(false)
    });
  }

  registerUser() {
    console.log(this.form.value);
    
    this.userDetails.email = this.form.value.email;
    this.userDetails.name = this.form.value.name;
    this.userDetails.lastName = this.form.value.lastName;
    this.userDetails.admin = this.form.value.admin;
    this.user.email = this.form.value.email;
    this.user.password = this.form.value.password;
    this.userdetailservice.addUser(this.user).subscribe(
        user => {
            
            this.userDetailService.insertUserDetails(this.userDetails, user.uid);
            this.indicatorService.insertUserIndicators(this.indicator, user.uid);
            this.userDetails.id = user.uid;
            this.notificacion.showNotification('top', 'center', 'success', 'check-square','Usuario creado con exito');
            this.dialogRef.close(this.userDetails);
                },
        error => {
            if(error == 'auth/email-already-exists'){
            this.notificacion.showNotification('top', 'center', 'danger', 'times-circle','Ya existe un usuario con ese correo');
            }
    });
  }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}