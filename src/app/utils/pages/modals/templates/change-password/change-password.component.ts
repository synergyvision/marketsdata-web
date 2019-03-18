import { Component, ViewEncapsulation, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl,FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { NotificationsPageComponent } from '../../../notifications/notifications.page.component';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-modal-change-password-modal',
  templateUrl: 'change-password.component.html',
  styleUrls: ['./styles/change-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  ngUnsubscribe = new Subject();
  validationMessages = {
    equal: [
      { type: 'areEqual', message: 'Las contraseñas deben coincidir' }
    ]
  };
  user: any;
  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private formBuilder: FormBuilder,
    public notificacion: NotificationsPageComponent,
    public afAuth: AngularFireAuth
  ) {
    this.form = formBuilder.group({
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        passwordrepeat: new FormControl('', [Validators.required, Validators.minLength(6)]),
    },
    {
      validator: (formGroup: FormGroup) => {
        const e1 = formGroup.get('password').value;
        const e2 = formGroup.get('passwordrepeat').value;

        return (e1 === e2) ? undefined : { areEqual: true };
      }
    });
  }

   ngOnInit() { 
    
   }

    changePassword(){
      this.user = this.afAuth.auth.currentUser;
      this.user.updatePassword(this.form.value.password).then(() => {
        this.notificacion.showNotification('top', 'center', 'success', 'check-square','Contraseña cambiada con exito');
        this.dialogRef.close();
      }).catch((error) =>  {
        this.notificacion.showNotification('top', 'center', 'danger', 'times-circle','Hubo un error');
      });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}