import { Component,  OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IndicatorsService } from '../services/indicators.service';
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
    displayedColumns: string[];
    columns: string[] = ['name', 'latestPrice', 'marketcap', 'sector', 'exchange', 'ttmEps'];                                
    selectedValue : string[];
    indicator: any = {};
    dataSource1 : MatTableDataSource<Company>;
    orders = [];
    @ViewChild('paginator') paginator: MatPaginator;
    private ngUnsubscribe = new Subject();
  
    constructor(
        public companyService: CompanyService,
        public indicatorService: IndicatorsService,
        public afAuth: AngularFireAuth,
        private route: ActivatedRoute
        ) {
          this.dataSource1 = new MatTableDataSource(route.snapshot.data['comapaniesData'].data);
          this.displayedColumns = this.columns;
         }

    ngOnInit(): void {
            let user = this.afAuth.auth.currentUser;
            let userId = user.uid;
            this.indicatorService.getUserIndicator(userId).pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(indicator =>{
                this.indicator = indicator;
                this.getParamsIndicators();
            });
            this.dataSource1.paginator = this.paginator;
    }

    selectionChanged() {
      this.displayedColumns = this.columns.concat(this.selectedValue);
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

  function getProp (obj, key) {
    return key.split('.').reduce( function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
};
