import { Component,  OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IndicatorsService } from '../services/indicators.service';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyService } from '../services/company.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Company } from '../models/company';

@Component({
  selector: 'app-blank-page',
  templateUrl: './blank-page.component.html',
  styleUrls: ['./styles/blank-page.component.scss']
})
export class BlankPageComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['name', 'marketcap'];
    
    indicator: any = {};
    form: FormGroup;
    dataSource1 : MatTableDataSource<Company>;
    @ViewChild('paginator') paginator: MatPaginator;
    private ngUnsubscribe = new Subject();
    
    orders = [{ enable: false, name: '' },
              { enable: false, name: '' },
              { enable: false, name: '' },
              { enable: false, name: '' },
              { enable: false, name: '' }];

    constructor(private formBuilder: FormBuilder,
        public companyService: CompanyService,
        public indicatorService: IndicatorsService,
        public afAuth: AngularFireAuth,
        private route: ActivatedRoute
        ) {
          this.dataSource1 = new MatTableDataSource(route.snapshot.data['comapaniesData'].data);
         
            const controls = this.orders.map(c => new FormControl(false));
                this.form = this.formBuilder.group({
                    orders: new FormArray(controls, minSelectedCheckboxes(1))
                });
         }
  
    submit() {
      const selectedOrderIds = this.form.value.orders
        .map((v, i) => v ? this.orders[i].name: null)
        .filter(v => v !== null);
  
      console.log(selectedOrderIds);
    }

    ngOnInit(): void {
            let user = this.afAuth.auth.currentUser;
            let userId = user.uid;
            this.indicatorService.getUserIndicator(userId).pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(indicator =>{
                this.indicator = indicator;
                this.getParamsIndicators();
                const controls = this.orders.map(c => new FormControl(false));
               
                this.form = this.formBuilder.group({
                    orders: new FormArray(controls, minSelectedCheckboxes(1))
                });
            });
            this.dataSource1.paginator = this.paginator;
    }

    getParamsIndicators() {
        this.orders = [];
        for (const param in this.indicator) {
           if(param != 'id'){
            this.orders.push({name: getProp(this.indicator,param+'.'+'name'), enable: getProp(this.indicator,param+'.'+'enable')});
           }
        }
    }

    ngOnDestroy(): void {
      this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}

function minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
  
      return totalSelected >= min ? null : { required: true };
    };
    return validator;
  }

  function getProp (obj, key) {
    return key.split('.').reduce( function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
};
