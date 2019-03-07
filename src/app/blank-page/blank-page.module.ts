import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlankPageComponent } from './blank-page.component';
import { CommonModule } from '@angular/common';
import { BlankPageResolver } from './blank-page.resolver';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CompanyService } from '../services/company.service'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MarketcapPipe } from './marketcap-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const BlankPageRoutes = [
  { path: '', component: BlankPageComponent, resolve: {
    comapaniesData: BlankPageResolver
  } }
];

@NgModule({
  declarations: [
    BlankPageComponent,
    MarketcapPipe
  ],
  imports: [
    RouterModule.forChild(BlankPageRoutes),
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BlankPageComponent, BlankPageResolver, CompanyService]
})
export class BlankPageModule { }
