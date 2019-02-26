import { Component, ViewEncapsulation, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { IndicatorsService } from '../../../../../services/indicators.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./styles/register.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterModalComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject();
  user: any;
  form: FormGroup;
  indicator: any = {};
  selectedUserIndicator: any = {};
  orders = [{ enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' }];
  
  constructor(public dialogRef: MatDialogRef<RegisterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public indicatorService: IndicatorsService,
  ) {
    this.user = data.user;
    const controls = this.orders.map(c => new FormControl(false));
        this.form = this.formBuilder.group({
            orders: new FormArray(controls)
        });
  }

  ngOnInit() {
    this.indicatorService.getUserIndicator(this.user.id).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(indicator => {
        this.indicator = indicator;
        this.getParamsIndicators();
        this.user.indicators = this.orders;

        const controls = this.orders.map(c => new FormControl(c.enable));
        this.form = this.formBuilder.group({
            orders: new FormArray(controls)
        });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
}

getParamsIndicators() {
  this.orders = [];
  for (const param in this.indicator) {
      if (param != 'id') {
          this.orders.push({
              name: getProp(this.indicator, param + '.' + 'name'),
              enable: getProp(this.indicator, param + '.' + 'enable')
          });
      }
  }
}

onSubmit(userId, formA: FormGroup) {
  let i = 0;
  this.indicatorService.getUserIndicator(userId).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(indicator => {
          this.selectedUserIndicator = indicator;
          for (const param in this.selectedUserIndicator) {
              if (param != 'id') {
                  this.selectedUserIndicator[param].enable = formA.value.orders[i];
                  i++;
              }
          }
          if (!(typeof (this.selectedUserIndicator.indicator1.enable) == "undefined"))
              this.indicatorService.updatetUserIndicators(this.selectedUserIndicator);
      });
}
}

function getProp(obj, key) {
  return key.split('.').reduce(function (o, x) {
      return (typeof o == "undefined" || o === null) ? o : o[x];
  }, obj);
};