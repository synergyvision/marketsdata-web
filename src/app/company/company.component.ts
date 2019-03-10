import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute,  ParamMap  } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';


@Component({
    selector: 'company',
    templateUrl: './company.component.html',
    styleUrls: ['./styles/company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy{
    
    private ngUnsubscribe = new Subject();
    company: string;
    
    constructor(public router: Router,
        public afAuth: AngularFireAuth, public route: ActivatedRoute){
            
                this.company = this.route.snapshot.paramMap.get('id');
                console.log(this.company);
                
            
        }
    
    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.company = params.get('id'))
          );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}