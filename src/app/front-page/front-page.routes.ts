import { Routes } from '@angular/router';
import { Error404PageComponent, Error404PageResolver } from '../core';
import { FrontPageComponent } from './front-page.component';

export const rootRoutes: Routes = [
  {
      path: '', 
      component: FrontPageComponent, 
      children:[
        { path: '', redirectTo: 'dashboard' },
        { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' },
        { path: 'forms', loadChildren: '../forms/forms.module#FormsModule' },
        { path: 'tables', loadChildren: '../tables/tables.module#TablesModule' },
        { path: 'charts', loadChildren: '../charts/charts.module#ChartsModule' },
        { path: 'utils', loadChildren: '../utils/utils.module#UtilsModule' },
        { path: 'layouts', loadChildren: '../layouts/layouts.module#LayoutsModule' },
        { path: 'blank-page', loadChildren: '../blank-page/blank-page.module#BlankPageModule' },
      ]},
      {
        path: '404',
        component: Error404PageComponent,
        resolve: { data: Error404PageResolver }
      },
      {
        // There's a bug that's preventing wild card routes to be lazy loaded (see: https://github.com/angular/angular/issues/13848)
        // That's why the Error page should be eagerly loaded
        path: '**',
        component: Error404PageComponent,
        resolve: { data: Error404PageResolver }
      }
];
