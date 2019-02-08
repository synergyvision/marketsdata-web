import { Component,  OnInit } from '@angular/core';
import { IndicatorsService } from '../services/indicators.service';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-blank-page',
  templateUrl: './blank-page.component.html',
  styleUrls: ['./styles/blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
    indicator: any = {};
    form: FormGroup;
    prueba = [];
    orders = [];
  
    constructor(private formBuilder: FormBuilder,
        public indicatorService: IndicatorsService,
        public afAuth: AngularFireAuth
        ) {
        this.orders.push({ id: 100, name: 'order 1' });
        this.orders.push({ id: 200, name: 'order 2' });
        this.orders.push({ id: 300, name: 'order 3' });
        this.orders.push({ id: 400, name: 'order 4' });
      const controls = this.orders.map(c => new FormControl(false));
      controls[0].setValue(true);
  
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
        this.indicatorService.getUserIndicator(userId).subscribe(indicator =>{
            this.indicator = indicator;
            this.getParamsIndicators();
        });
    }

    getParamsIndicators(){
        for (const param in this.indicator) {
           if(param != 'id'){

            this.orders.push({name: getProp(this.indicator,param+'.'+'name'), enable: getProp(this.indicator,param+'.'+'enable')});
           }
        }
        console.log(this.orders);
        
        
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
