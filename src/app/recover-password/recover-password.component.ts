import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./styles/recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  user: any = {};

  constructor(public router: Router,
    public afAuth: AngularFireAuth
    ) { }

  ngOnInit() {
  }

  onCancelar(){
    this.router.navigate(['/login']);
  }

  onRecuperar(){
    this.afAuth.auth.sendPasswordResetEmail(this.user.email)
    .then(() => {
      
    })
    .catch(error => console.log(error));
  }
}
