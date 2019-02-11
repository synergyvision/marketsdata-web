import { Component,  OnInit } from '@angular/core';
import { UserdetailService } from '../services/userdetail.service';
import { IndicatorsService } from '../services/indicators.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./styles/users.component.scss']
})
export class UsersComponent implements OnInit {
    users = [];
    orders = [];
    indicator: any = {};
    constructor( public userdetailservice: UserdetailService,
        public indicatorService: IndicatorsService,
       
        ){}
   
    ngOnInit(){
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
}


function getProp (obj, key) {
    return key.split('.').reduce( function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
};