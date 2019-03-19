import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfilResolver } from './perfil.resolver';

export const PerfilRoutes = [
  { path: '', component: PerfilComponent, resolve: { userData: PerfilResolver
  } }
];

@NgModule({
  declarations: [
    PerfilComponent,
  ],
  imports: [
    RouterModule.forChild(PerfilRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [PerfilComponent, PerfilResolver]
})
export class PerfilModule { }
