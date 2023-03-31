import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {HttpClient,HttpClientModule } from '@angular/common/http';
import { AngularFireModule} from '@angular/fire/compat'​

import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';​

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireDatabaseModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Camera],
  bootstrap: [AppComponent],
})
export class AppModule {}
