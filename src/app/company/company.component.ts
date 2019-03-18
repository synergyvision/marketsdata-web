import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute,  ParamMap  } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { CompanyService } from '../services/company.service';


@Component({
    selector: 'company',
    templateUrl: './company.component.html',
    styleUrls: ['./styles/company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy{
    
    private ngUnsubscribe = new Subject();
    company: string;
    companyDetail: any = {};
    constructor(public router: Router,
        public afAuth: AngularFireAuth, public route: ActivatedRoute,
        public companyService: CompanyService
        ){
            
            this.company = this.route.snapshot.paramMap.get('id');
            this.getCompany();
                
            
        }
    
    ngOnInit() {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getCompany(){
        this.companyService.getCompany(this.company).subscribe((company)=>{
            this.companyDetail = company;
            
        })
    }
}