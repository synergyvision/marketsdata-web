import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotificationsPageComponent } from '../utils';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./styles/recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  public form: FormGroup;
  user: any = {};
  baseUrl = '';
  validationMessages = {
    email: [
      { type: 'required', message: 'El correo es obligatorio.' },
      { type: 'email', message: 'El correo debe ser válido.' }
    ]
  };

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    public router: Router,
    public afAuth: AngularFireAuth,
    public formBuilder: FormBuilder,
    public notificacion: NotificationsPageComponent
    ) {
      this.baseUrl = baseHref;
      this.form = formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.email,
          Validators.required
        ]))}
      );
     }

  ngOnInit() {
  }

  onCancelar(){
    this.router.navigate(['/login']);
  }

  onRecuperar(){
    this.afAuth.auth.sendPasswordResetEmail(this.form.get('email').value)
    .then(() => {
        this.notificacion.showNotification('top', 'center', 'success', 'check-square','Te hemos enviado un correo revisa tu bandeja de entrada');
        setTimeout(() => { this.router.navigate(['/login']); }, 3000);
    })
    .catch(error => {
      this.notificacion.showNotification('top', 'center', 'danger', 'times-circle','No existe usario con ese correo');
      this.form.reset();

    });
  }
}
