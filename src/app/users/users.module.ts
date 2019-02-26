import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {  UsersResolver } from './users.resolve';
import { TableDataService } from '../tables/services/table-data.service';
import { MatTableModule } from '@angular/material/table';
import { UserdetailService } from '../services/userdetail.service';

export const UsersRoutes = [
  { path: '', component: UsersComponent,
   resolve: { userData: UsersResolver
  } }
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
    MatSlideToggleModule,
    MatTableModule,
  ],
  providers: [UsersComponent,
              TableDataService,
              UsersResolver,
              UserdetailService
  ]
})
export class UsersModule { }
