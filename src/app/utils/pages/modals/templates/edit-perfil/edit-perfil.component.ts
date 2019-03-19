import { Component, ViewEncapsulation, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserdetailService } from '../../../../../services/userdetail.service';
import { NotificationsPageComponent } from '../../../notifications/notifications.page.component';
import { User } from '../../../../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-modal-edit-perfil',
  templateUrl: 'edit-perfil.component.html',
  styleUrls: ['./styles/edit-perfil.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditPerfilComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject();
  form: FormGroup;
  userDetails: any = {};
  
  constructor(public dialogRef: MatDialogRef<EditPerfilComponent>,
    private formBuilder: FormBuilder,
    public notificacion: NotificationsPageComponent,
    public userDeatilService: UserdetailService,
    public afAuth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
      console.log(data);
      
        this.form = formBuilder.group({
            name: new FormControl(data.user.name, Validators.required),
            lastName: new FormControl(data.user.lastName, Validators.required),
    });
    
  }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    updateDetails() {
        this.userDeatilService.getUserDetail(this.data.user.id).pipe(take(1)).subscribe((userDetail)=>{
            this.userDetails.email = userDetail.email;
            this.userDetails.name = this.form.value.name;
            this.userDetails.lastName = this.form.value.lastName;
            this.userDetails.admin = userDetail.admin;
            this.userDeatilService.insertUserDetails(this.userDetails, this.data.user.id);
            this.notificacion.showNotification('top', 'center', 'success', 'check-square','Cambios guardados con exito');
            this.dialogRef.close(this.userDetails);
        });
        
    }
}