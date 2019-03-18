import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from '../utils/pages/modals/templates/change-password/change-password.component';
import { ChangeEmailComponent } from '../utils/pages/modals/templates/change-email/change-email.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./styles/perfil.component.scss']
})
export class PerfilComponent implements OnInit {
   
    constructor(public dialog: MatDialog
    
      ) {
        
      }

    ngOnInit() {}

    changePassword(){
      const dialogRef = this.dialog.open(ChangePasswordComponent);
    }

    changeEmail(){
      const dialogRef = this.dialog.open(ChangeEmailComponent);
    }


}
