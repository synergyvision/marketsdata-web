import { Component,  OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IndicatorsService } from '../services/indicators.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyService } from '../services/company.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Company } from '../models/company';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { SectorService } from '../services/sector.service';

@Component({
  selector: 'app-blank-page',
  templateUrl: './blank-page.component.html',
  styleUrls: ['./styles/blank-page.component.scss']
})
export class BlankPageComponent implements OnInit, OnDestroy {
    form: FormGroup;
    displayedColumns: string[];
    columns: string[] = ['rank','name', 'latestPrice', 'marketcap', 'sector', 'exchange', 'ttmEps'];                                
    selectedValue : string[];
    indicator: any = {};
    dataSource1 : MatTableDataSource<Company>;
    orders = [];
    data = [];
    dataFija = [];
    dataMovil = [];
    dataFijaMovil = [];
    exchanges = ['Todos','NASDAQ','NYSE'];
    sectors = [];

    @ViewChild('paginator') paginator: MatPaginator;
    private ngUnsubscribe = new Subject();
  
    constructor(
        public companyService: CompanyService,
        public indicatorService: IndicatorsService,
        public afAuth: AngularFireAuth,
        public route: ActivatedRoute,
        public formBuilder: FormBuilder,
        public sectorService: SectorService
        ) {
          this.form = formBuilder.group({
            exchange: new FormControl(''),
            sector: new FormControl(''),
            marketcap: new FormControl('',[marketCapValidator]),
            peratio: new FormControl('')
          });
          this.data = route.snapshot.data['comapaniesData'].data;
          this.data.forEach(value => {
              this.dataFija.push(value);
              this.dataFijaMovil.push(value);
              this.dataMovil.push(value);
          });
          
          this.dataSource1 = new MatTableDataSource(this.data);
          this.displayedColumns = this.columns;
         }

    ngOnInit(): void {
            let user = this.afAuth.auth.currentUser;
            let userId = user.uid;
            this.indicatorService.getUserIndicator(userId).pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(indicator => {
                this.indicator = indicator;
                this.getParamsIndicators();
            });
            this.dataSource1.paginator = this.paginator;
            this.sectorService.getSectors().subscribe((sectors)=>{
                this.sectors = sectors;
            });
    }

    selectionChanged() {
      if(this.selectedValue.length == 0) {
          this.dataSource1.paginator = this.paginator;
          this.displayedColumns = this.columns.concat(this.selectedValue);
          this.dataSource1 = new MatTableDataSource(this.dataFijaMovil);
          this.dataSource1.paginator = this.paginator;
      } else {
        this.dataMovil = this.getRanking(this.selectedValue);
        this.dataSource1 = new MatTableDataSource(this.dataMovil);
        this.dataSource1.paginator = this.paginator;
        this.displayedColumns = this.columns.concat(this.selectedValue);
      }
    }

    getRanking(selectedValue) {
        let rankings = [];
        selectedValue.forEach(value => {
            let individualRanking = [];
            if(value != 'peRatio') {
              this.dataMovil.sort(function (a, b) {
                return (b[value] - a[value]);
              });
            } else {
              this.dataMovil.sort(function (a, b) {
                return (a[value] - b[value]);
              });
            }
              this.dataMovil.forEach(value => {
                individualRanking.push(value);
              });
            rankings.push(individualRanking);
        })

        let symbols = rankings[0].map(value => value.symbol);
        let rank = 0;

        symbols.forEach((value,i) => {
          rank = 0;
          rankings.forEach(companyRanking =>{
            rank += companyRanking.map(e => { return e.symbol; }).indexOf(value);
          })
          
        //  console.log(`${i} -- La compañia ${value} esta en la posicion ${rank}`);
         rankings[0][i].rank = rank;
        })

        rankings[0].sort(function (a, b) {
          return (a['rank'] - b['rank']);
        });
        
        return rankings[0];
    }

    onSubmit() {
      this.dataFijaMovil = [];
      this.dataMovil = [];

      if(this.form.value.exchange == 'Todos' && this.form.value.sector == 'Todos') {
          this.dataFija.forEach(value => {
              this.dataFijaMovil.push(value);
          });
      } else if(this.form.value.exchange == 'Todos') {
        this.dataFija.forEach(value => {
            if(value.sector == this.form.value.sector){
                this.dataFijaMovil.push(value);
            }  
        });
      } else if(this.form.value.sector == 'Todos') {
        this.dataFija.forEach(value => {
            if(value.exchange == this.form.value.exchange){
                this.dataFijaMovil.push(value);
            }  
        });
      } else {
          this.dataFija.forEach(value => {
            if(value.exchange == this.form.value.exchange && value.sector == this.form.value.sector) {
              this.dataFijaMovil.push(value);
            }
        });
      }
      
      this.dataFijaMovil.forEach(value => {
        this.dataMovil.push(value);
      });
        this.dataSource1 = new MatTableDataSource(this.dataFijaMovil);
        this.dataSource1.paginator = this.paginator;
    }

    getParamsIndicators() {
        this.orders = [];
        for (const param in this.indicator) {
           if(param != 'id'){
            this.orders.push({name: getProp(this.indicator,param+'.'+'name'), enable: getProp(this.indicator,param+'.'+'enable'), value: getProp(this.indicator,param+'.'+'value')});
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

function marketCapValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value !== undefined && (isNaN(control.value) || control.value < 50000000)) {
      return { 'marketCap': true };
  }
  return null;
}