import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecoverPasswordComponent } from './recover-password.component';

export const RecoverPasswordRoutes = [
  { path: '', component: RecoverPasswordComponent }
];

@NgModule({
  declarations: [
    
  ],
  imports: [
    RouterModule.forChild(RecoverPasswordRoutes)
  ],
  providers: [RecoverPasswordComponent]
})
export class RecoverPasswordModule { }
