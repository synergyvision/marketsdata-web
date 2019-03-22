import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/database';

export const RegisterRoutes = [
  { path: '', component: RegisterComponent }
];

@NgModule({
  declarations: [
    
  ],
  imports: [
    RouterModule.forChild(RegisterRoutes),
    FormsModule,
    AngularFireDatabaseModule,
  ],
  providers: [RegisterComponent]
})
export class RegisterModule { }
