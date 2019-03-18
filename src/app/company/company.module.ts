import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';
export const CompanyRoutes = [
    { path:'', component: CompanyComponent }
];

@NgModule({
    declarations: [
        CompanyComponent,
       
    ],
    imports:[
        RouterModule.forChild(CompanyRoutes),
    ],
    providers: [
        CompanyComponent
    ]
})
export class CompanyModule{}