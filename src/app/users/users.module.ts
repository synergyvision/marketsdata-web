import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


export const UsersRoutes = [
  { path: '', component: UsersComponent }
];

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    RouterModule.forChild(UsersRoutes),
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  providers: [UsersComponent]
})
export class UsersModule { }
