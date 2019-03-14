import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const PerfilRoutes = [
  { path: '', component: PerfilComponent }
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
  providers: [PerfilComponent]
})
export class PerfilModule { }
