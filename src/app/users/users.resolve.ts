import { Injectable, OnDestroy } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserdetailService } from '../services/userdetail.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class UsersResolver implements Resolve<any>, OnDestroy {
  private ngUnsubscribe = new Subject();

  constructor(private userDetailsevice: UserdetailService) {}
  resolve() {
    return new Promise((resolve, reject) => {
      this.userDetailsevice.getUsersDetails().pipe(takeUntil(this.ngUnsubscribe))
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

