import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./styles/change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy{
    
    private ngUnsubscribe = new Subject();
    
    user: any = {};
    mode: string;
    actionCode: string;
    

    constructor(public router: Router,
        public afAuth: AngularFireAuth, public route: ActivatedRoute){
            this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
                this.mode = params['mode'];
                this.actionCode = params['oobCode'];
            });
        }
    
    ngOnInit() {}

    onCancelar(){
        this.router.navigate(['/login']);
    }

    onRestablecer() {
        this.afAuth.auth.verifyPasswordResetCode(this.actionCode)
        .then(() => {
            this.afAuth.auth.confirmPasswordReset(this.actionCode, this.user.newpassword)
            .then(() => {
                this.router.navigate(['/login']);
            }).catch(error => console.log(error));

        }).catch(error => console.log(error));
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}