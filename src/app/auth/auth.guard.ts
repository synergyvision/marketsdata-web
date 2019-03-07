import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    state: Observable<firebase.User>;
    user: any;
    isLoggedIn: boolean;
    constructor(private router: Router,
        private afAuth: AngularFireAuth,
        private af: AngularFireModule) { }

        canActivate(): Observable<boolean> | boolean {
            if (typeof window !== 'undefined') {
              return this.afAuth.user.pipe(
                take(1),
                map(state => !!state),
                tap(loggedIn => {
                  if (!loggedIn) {
                    this.router.navigate(['/login']);
                  } 
                })
              );
            }
            return true;
        }
}