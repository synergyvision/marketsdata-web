import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password.component';

export const ChangePasswordRoutes = [
    { path:'', component: ChangePasswordComponent }
];

@NgModule({
    declarations: [
        ChangePasswordComponent
    ],
    imports:[
        RouterModule.forChild(ChangePasswordRoutes)
    ],
    providers: [
        ChangePasswordComponent
    ]
})
export class ChangePasswordModule{}