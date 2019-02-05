import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styles: ['./styles/change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit{
    
    user: any = {};
    mode: string;
    actionCode: string;
    

    constructor(public router: Router,
        public afAuth: AngularFireAuth, public route: ActivatedRoute){
            this.route.queryParams.subscribe(params => {
                this.mode = params['mode'];
                this.actionCode = params['oobCode'];
            });
        }
    
    ngOnInit() {}

    onCancelar(){
        this.router.navigate(['/login']);
    }

    onRestablecer(){
        this.afAuth.auth.verifyPasswordResetCode(this.actionCode)
        .then(() => {
            
            this.afAuth.auth.confirmPasswordReset(this.actionCode, this.user.newpassword)
            .then(() => {
                this.router.navigate(['/dashboard']);
            }).catch(error => console.log(error));

        }).catch(error => console.log(error));
    }
}