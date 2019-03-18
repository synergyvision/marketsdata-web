import { Component, ViewEncapsulation, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl,FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { NotificationsPageComponent } from '../../../notifications/notifications.page.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserdetailService } from '../../../../../services/userdetail.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-modal-change-email-modal',
  templateUrl: 'change-email.component.html',
  styleUrls: ['./styles/change-email.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeEmailComponent implements OnInit, OnDestroy {
  form: FormGroup;
  ngUnsubscribe = new Subject();
  validationMessages = {
    email: [
        { type: 'required', message: 'El correo es obligatorio' },
        { type: 'email', message: 'El correo debe ser valido' }
      ]
  };
  user: any;
  userDetails: any = {};
  constructor(public dialogRef: MatDialogRef<ChangeEmailComponent>,
    private formBuilder: FormBuilder,
    public notificacion: NotificationsPageComponent,
    public afAuth: AngularFireAuth,
    public userDetailservice: UserdetailService
  ) {
    this.form = formBuilder.group({
        email: new FormControl('', Validators.compose([
            Validators.email,
            Validators.required
          ]))
    });
  }

   ngOnInit() { 
    
   }

    changeEmail() {
      this.user = this.afAuth.auth.currentUser;
      this.user.updateEmail(this.form.value.email).then(() => {
        this.userDetailservice.getUserDetail(this.user.uid).pipe(take(1)).subscribe((userDetail)=>{
            this.userDetails.email = this.form.value.email;
            this.userDetails.name = userDetail.name;
            this.userDetails.lastName = userDetail.lastName;
            this.userDetails.admin = userDetail.admin;
            this.userDetailservice.insertUserDetails(this.userDetails, this.user.uid);
        });
        this.notificacion.showNotification('top', 'center', 'success', 'check-square','Correo cambiado con exito');
        this.dialogRef.close(this.form.value.email);
      }).catch((error) =>  {
        if(error.code == 'auth/requires-recent-login'){
            this.notificacion.showNotification('top', 'center', 'danger', 'times-circle','Debe logear otra vez para poder cambiar el correo');
        } else if(error.code == 'auth/email-already-in-use') {
            this.notificacion.showNotification('top', 'center', 'danger', 'times-circle','Correo ya en uso');
        } else {
            this.notificacion.showNotification('top', 'center', 'danger', 'times-circle','Hubo un error');
        }
        
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