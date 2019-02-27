import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlankPageComponent } from './blank-page.component';
import { CommonModule } from '@angular/common';
import { BlankPageResolver } from './blank-page.resolver';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CompanyService } from '../services/company.service'
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
    MatTableModule,
    MatPaginatorModule,
    MatButtonToggleModule
  ],
  providers: [BlankPageComponent, BlankPageResolver, CompanyService]
})
export class BlankPageModule { }
