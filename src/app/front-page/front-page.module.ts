
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { FrontPageComponent } from './front-page.component';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../../environments/environment';

import { rootRoutes } from './front-page.routes';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    FrontPageComponent
  ],
  imports: [
    HttpClientModule,
    RouterModule.forChild(rootRoutes),
    CoreModule,
    SharedModule,
    TransferHttpCacheModule
  ],
  bootstrap: [FrontPageComponent],
  providers: []
})
export class FrontPageModule { }
