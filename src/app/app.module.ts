import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from './../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { rootRoutes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { AuthGuard } from './auth/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { RegisterModalComponent } from './utils/pages/modals/templates/register/register.component';
import { NotificationsPageComponent } from './utils';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoverPasswordComponent,
    ChangePasswordComponent,
    RegisterModalComponent
  ],
  entryComponents: [RegisterModalComponent],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, 
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule,
    RouterModule.forRoot(rootRoutes, {
      // enableTracing :true, // For debugging
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabled',
      useHash: false
    }),
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    TransferHttpCacheModule,
    FormsModule
  ],
  bootstrap: [AppComponent],
  providers: [AuthGuard,
    {
      provide: APP_BASE_HREF,
      useValue: `${environment.BASE_URL}`
    },
    NotificationsPageComponent
  ]
})
export class AppModule { }
