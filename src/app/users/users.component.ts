import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserdetailService } from '../services/userdetail.service';
import { IndicatorsService } from '../services/indicators.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
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
    selectedUserIndicator: any = {};
    users: any = [];
    indicator: any = {};
    formA: FormGroup[] = [];
    form: FormGroup;
    dataSource: MatTableDataSource<UserDetail>;

    orders = [{ enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' },
    { enable: false, name: '' }];

    constructor(public userdetailservice: UserdetailService,
        public indicatorService: IndicatorsService,
        private afAuth: AngularFireAuth,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public notificacion: NotificationsPageComponent
    ) {
        this.userSource = route.snapshot.data['userData'].data;
        this.dataSource= new MatTableDataSource(this.userSource);
        const controls = this.orders.map(c => new FormControl(false));
        this.form = this.formBuilder.group({
            orders: new FormArray(controls)
        });

        for (let i = 0; i < this.userSource.length; i++) {
            this.formA.push(this.form);
        }
    }

    ngOnInit() {
        this.userdetailservice.getUsersDetails().pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(user => {
                this.dataSource = new MatTableDataSource(user);
            });
    }

    getParamsIndicators() {
        this.orders = [];
        for (const param in this.indicator) {
            if (param != 'id') {
                this.orders.push({
                    name: getProp(this.indicator, param + '.' + 'name'),
                    enable: getProp(this.indicator, param + '.' + 'enable')
                });
            }
        }
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

    onSubmit(userId, formA: FormGroup) {
        let i = 0;
        this.indicatorService.getUserIndicator(userId).pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(indicator => {
                this.selectedUserIndicator = indicator;
                for (const param in this.selectedUserIndicator) {
                    if (param != 'id') {
                        this.selectedUserIndicator[param].enable = formA.value.orders[i];
                        i++;
                    }
                }
                if (!(typeof (this.selectedUserIndicator.indicator1.enable) == "undefined"))
                    this.indicatorService.updatetUserIndicators(this.selectedUserIndicator);
            });
    }
    
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}

function getProp(obj, key) {
    return key.split('.').reduce(function (o, x) {
        return (typeof o == "undefined" || o === null) ? o : o[x];
    }, obj);
};