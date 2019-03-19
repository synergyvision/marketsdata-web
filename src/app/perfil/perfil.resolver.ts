import { Injectable, OnDestroy } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserdetailService } from '../services/userdetail.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class PerfilResolver implements Resolve<any>, OnDestroy {
  private ngUnsubscribe = new Subject();

  constructor(private userDetailsevice: UserdetailService,
    public afAuth: AngularFireAuth,) {}
  resolve() {
    return new Promise((resolve, reject) => {
      let user = this.afAuth.auth.currentUser;
      let userId = user.uid;
      this.userDetailsevice.getUserDetail(userId).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userData: any) => {
        return resolve({
          data: userData
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

