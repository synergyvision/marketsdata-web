import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserdetailService } from '../services/userdetail.service';
import { IndicatorsService } from '../services/indicators.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { RegisterModalComponent } from '../utils/pages/modals/templates/register/register.component';
import { NewUserComponent } from '../utils/pages/modals/templates/newuser/newuser.component';
import { UserDetail } from '../models/userDetail';
import { AlertComponent } from '../shared';
import { NotificationsPageComponent } from '../utils';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./styles/users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
    ngUnsubscribe = new Subject();
    displayedColumns: string[] = ['name', 'lastname', 'email', 'options'];
    userSource = undefined;
    dataSource: MatTableDataSource<UserDetail>;


    constructor(public userdetailservice: UserdetailService,
        public indicatorService: IndicatorsService,
        private afAuth: AngularFireAuth,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public notificacion: NotificationsPageComponent
    ) {
        this.userSource = route.snapshot.data['userData'].data;
        this.dataSource= new MatTableDataSource(this.userSource);
    }

    ngOnInit() {
        this.userdetailservice.getUsersDetails().pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(user => {
                this.dataSource = new MatTableDataSource(user);
            });
    }

    deleteUser(id) {
        const dialogRef = this.dialog.open(AlertComponent, {
            data: {
              icon: 'exclamation-circle',
              iconColor: 'failure',
              title: '¿Deseas borrar este usuario?',
              text: 'No seras capaz de deshacer esta acción',
              options: true
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.userdetailservice.deleteUser(id).subscribe();
              this.indicatorService.deleteIndicators(id);
                this.dialog.open(AlertComponent, {
                    data: {
                      icon: 'check-circle',
                      iconColor: 'success',
                      title: 'Borrado',
                      text: 'El usuario ha sido borrado',
                      button: 'OK'
                    }
                  });
              
            } else {
              this.dialog.open(AlertComponent, {
                data: {
                  icon: 'times-circle',
                  iconColor: 'failure',
                  title: 'Cancelado',
                  text: 'El usuario no ha sido borrado',
                  button: 'OK'
                }
              });
            }
          });
    }

    registerModal(user: UserDetail): void {
        const dialogRef = this.dialog.open(RegisterModalComponent,{
            data: {
             user
            }
          });
    }

    newUserModal(): void {
        const dialogRef = this.dialog.open(NewUserComponent);

    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}

