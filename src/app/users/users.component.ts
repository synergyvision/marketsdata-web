import { Component,  OnInit } from '@angular/core';
import { UserdetailService } from '../services/userdetail.service';
import { IndicatorsService } from '../services/indicators.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./styles/users.component.scss']
})
export class UsersComponent implements OnInit {
    selectedUserIndicator: any = {};
    users: any = {};
    indicator: any = {};
    form: FormGroup;

    orders = [{ enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' }];

    constructor( public userdetailservice: UserdetailService,
        public indicatorService: IndicatorsService,
        private afAuth: AngularFireAuth,
        private formBuilder: FormBuilder
       
        ){
            const controls = this.orders.map(c => new FormControl(false));
                this.form = this.formBuilder.group({
                    orders: new FormArray(controls)
            });
        }
   
    ngOnInit(){
        /*
        this.userdetailservice.getUsersDetails().subscribe(user => {
            this.users = user;
            this.users.forEach( (valor) =>{ 
            this.indicatorService.getUserIndicator(valor.id).subscribe(indicator => {
                this.indicator = indicator;
                this.getParamsIndicators();
                valor.indicators = this.orders;
            });
        });
        console.log(this.users);
    });*/   
            var usuario = this.afAuth.auth.currentUser;
            var userId = usuario.uid;
            this.userdetailservice.getUserDetail(userId).subscribe(user => {
                this.users = user;
                this.indicatorService.getUserIndicator(userId).subscribe(indicator => {
                    this.indicator = indicator;
                   
                    
                    this.getParamsIndicators();
                    this.users.indicators = this.orders;

                    const controls = this.orders.map(c => new FormControl(c.enable));
                    this.form = this.formBuilder.group({
                    orders: new FormArray(controls)
                });
            });   
        });
    }

    getParamsIndicators(){
        this.orders = [];
        for (const param in this.indicator) {
           if(param != 'id'){
            this.orders.push({name: getProp(this.indicator,param+'.'+'name'), enable: getProp(this.indicator,param+'.'+'enable')});
           }
        }
    }

    onSubmit(userId){
        let i = 0;
        this.indicatorService.getUserIndicator(userId).subscribe(indicator => {
            this.selectedUserIndicator = indicator;
            for(const param in this.selectedUserIndicator){
                if(param != 'id'){
                    this.selectedUserIndicator[param].enable = this.form.value.orders[i];
                    i++;
                }
            }
           if(!(typeof (this.selectedUserIndicator.indicator1.enable) == "undefined"))
                this.indicatorService.updatetUserIndicators(this.selectedUserIndicator);
            
        });   
    }
}

function getProp (obj, key) {
    return key.split('.').reduce( function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
};