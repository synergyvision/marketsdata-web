import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { NotificationsPageComponent } from './pages/notifications/notifications.page.component';


export const utilsRoutes = [
  {
    path: 'notifications',
    component: NotificationsPageComponent
  },
];

@NgModule({
  declarations: [
    NotificationsPageComponent,
  ],
  providers: [],
  entryComponents: [],
  imports: [
    RouterModule.forChild(utilsRoutes),
    SharedModule
  ]
})
export class UtilsModule { }
