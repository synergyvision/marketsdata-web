import { Component,  OnInit, OnDestroy } from '@angular/core';
import { UserdetailService } from '../services/userdetail.service';
import { IndicatorsService } from '../services/indicators.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./styles/users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
    ngUnsubscribe = new Subject();
    displayedColumns: string[] = ['id','name', 'lastname', 'job', 'age','indicators','options'];
    userSource = undefined;
    selectedUserIndicator: any = {};
    users: any = [];
    indicator: any = {};
    formA: FormGroup[] = [];
    form: FormGroup;

    orders = [{ enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' }];

    constructor( public userdetailservice: UserdetailService,
        public indicatorService: IndicatorsService,
        private afAuth: AngularFireAuth,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute
        ){
            this.userSource = route.snapshot.data['userData'].data;
            const controls = this.orders.map(c => new FormControl(false));
            this.form = this.formBuilder.group({
                orders: new FormArray(controls)
            });

            for (let i = 0; i < this.userSource.length; i++){
                this.formA.push(this.form);
            }
        }
   
        ngOnInit() {
           
            this.userdetailservice.getUsersDetails().pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(user => {
               
                this.users = user;
                    var i = 0;
    
                    this.users.forEach(valor => { 
                    this.indicatorService.getUserIndicator(valor.id).pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe(indicator => {
                        this.indicator = indicator;
                        this.getParamsIndicators();
                        valor.indicators = this.orders;
                       
                        
                        const controls = this.orders.map(c => new FormControl(c.enable));
                            this.form = this.formBuilder.group({
                            orders: new FormArray(controls)
                        });
                        this.formA[i] = this.form;
                        i++;
                    });
                });
        });
    }

    getParamsIndicators(){
        this.orders = [];
        for (const param in this.indicator) {
           if(param != 'id'){
            this.orders.push({name: getProp(this.indicator,param+'.'+'name'), 
            enable: getProp(this.indicator,param+'.'+'enable')});
           }
        }
    }

    onSubmit(userId, formA: FormGroup){
        let i = 0;
        this.indicatorService.getUserIndicator(userId).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(indicator => {
            this.selectedUserIndicator = indicator;
            for(const param in this.selectedUserIndicator){
                if(param != 'id'){
                    this.selectedUserIndicator[param].enable = formA.value.orders[i];
                    i++;
                }
            }
           if(!(typeof (this.selectedUserIndicator.indicator1.enable) == "undefined"))
                this.indicatorService.updatetUserIndicators(this.selectedUserIndicator);
        });   
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}

function getProp (obj, key) {
    return key.split('.').reduce( function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
};