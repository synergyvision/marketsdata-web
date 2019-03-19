import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from '../utils/pages/modals/templates/change-password/change-password.component';
import { ChangeEmailComponent } from '../utils/pages/modals/templates/change-email/change-email.component';
import { EditPerfilComponent } from '../utils/pages/modals/templates/edit-perfil/edit-perfil.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./styles/perfil.component.scss']
})
export class PerfilComponent implements OnInit {
    userSource: any;
    constructor(public dialog: MatDialog,
      private route: ActivatedRoute,
      ) {
        this.userSource = route.snapshot.data['userData'].data;
        
        
      }

    ngOnInit() {}

    changePassword(){
      const dialogRef = this.dialog.open(ChangePasswordComponent);
    }

    changeEmail(){
      const dialogRef = this.dialog.open(ChangeEmailComponent);
    }
    

    updatePerfil(){
      let user = this.userSource;
      const dialogRef = this.dialog.open(EditPerfilComponent, {
        data: { user }
      });
    }

}
