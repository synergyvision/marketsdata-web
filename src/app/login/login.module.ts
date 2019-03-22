import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/database';

export const LoginRoutes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [
    
  ],
  imports: [
    RouterModule.forChild(LoginRoutes),
    FormsModule,
    AngularFireDatabaseModule,
  ],
  providers: [LoginComponent]
})
export class LoginModule { }
