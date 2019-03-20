import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TimesheetComponent } from './components/home/new_items/timesheet/timesheet.component';
import { ClientComponent } from './components//home/new_items/client/client.component';
import { LawyerComponent } from './components//home/new_items/lawyer/lawyer.component';
import { MatterComponent } from './components//home/new_items/matter/matter.component';

import { Edit_TimesheetComponent } from './components/home/edit_items/timesheet/edit_timesheet.component';
import { Edit_ClientComponent } from './components/home/edit_items/client/edit_client.component';
import { Edit_LawyerComponent } from './components/home/edit_items/lawyer/edit_lawyer.component';
import { Edit_MatterComponent } from './components/home/edit_items/matter/edit_matter.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    LawyerComponent,
    HomeComponent,
    MatterComponent,
    TimesheetComponent,
    Edit_ClientComponent,
    Edit_LawyerComponent,
    Edit_MatterComponent,
    Edit_TimesheetComponent,
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
