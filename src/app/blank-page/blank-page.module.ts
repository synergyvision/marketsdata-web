import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlankPageComponent } from './blank-page.component';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

export const BlankPageRoutes = [
  { path: '', component: BlankPageComponent }
];

@NgModule({
  declarations: [
    BlankPageComponent
  ],
  imports: [
    RouterModule.forChild(BlankPageRoutes),
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BlankPageComponent]
})
export class BlankPageModule { }
