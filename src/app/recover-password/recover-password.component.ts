import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styles: ['./styles/recover-password.component.sccs']
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
      console.log("Correo enviado al usuario");
    })
    .catch(error => console.log(error));
  }
}
