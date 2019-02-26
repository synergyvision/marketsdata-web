import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlankPageComponent } from './blank-page.component';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BlankPageResolver } from './blank-page.resolver';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CompanyService } from '../services/company.service'

export const BlankPageRoutes = [
  { path: '', component: BlankPageComponent, resolve: {
    comapaniesData: BlankPageResolver
  } }
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
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [BlankPageComponent, BlankPageResolver, CompanyService]
})
export class BlankPageModule { }
