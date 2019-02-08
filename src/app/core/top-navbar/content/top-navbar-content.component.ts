import { Component, Input, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { SideMenuService } from '../../side-menu/side-menu.service';
import { ResponsiveBreakpointsService } from '../../responsive-breakpoints/responsive-breakpoints.service';
import { APP_BASE_HREF } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserdetailService } from '../../../services/userdetail.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-top-navbar-content',
  styleUrls: ['./styles/top-navbar-content.scss'],
  templateUrl: './top-navbar-content.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarContentComponent  implements OnInit {
  
  @Input() messages = [];
  @Input() notifications = [];
  user: any = {};
  sideMenuVisible = true;
  baseUrl = '';

  constructor(
    public userdetailservice: UserdetailService,
    public afAuth: AngularFireAuth,
    public authService: AuthService,
    public router: Router,
    private sideMenuService: SideMenuService,
    private responsiveService: ResponsiveBreakpointsService,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {
    this.baseUrl = baseHref;

    responsiveService.responsiveSubject
      .pipe(
        filter(breakpoint => breakpoint.screen === 'xs-or-sm')
      )
      .subscribe(breakpoint => {
        if (breakpoint.active) {
          this.sideMenuService.sidenav.mode = 'push';
          this.sideMenuService.sidenav.close().then(
            val => {
              // console.log('ok closing');
              this.sideMenuVisible = false;
            },
            err => {
              // console.log('error closing');
            },
            () => {
              // console.log('all closing');
            }
          );
        } else {
          this.sideMenuService.sidenav.mode = 'side';
        }
      });
  }

  toggleSideMenu(): void {
    this.sideMenuService.sidenav.toggle().then(
      val => {
        this.sideMenuVisible = !this.sideMenuVisible;
      },
      err => {
        // console.log('error toggle');
      },
      () => {
        // console.log('all toggle');
      }
    );
  }

  onLogout(){
      this.authService.logoutUser()
      .then(() => {
          this.router.navigate(['/login']);
    }).catch(error => console.log(error));
  }

  ngOnInit(): void {
    let user = this.afAuth.auth.currentUser;
    let userId = user.uid;
    this.userdetailservice.getUserDetail(userId).subscribe(user => {
      this.user = user;
    });
    
  }
}
