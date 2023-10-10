import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
import { MenubarModule } from 'primeng/menubar';
import { registerLocaleData } from '@angular/common';
import { AppComponent } from "./app.component";
import { AppRoutingModule } from './app-routing.module';


import localeNl from '@angular/common/locales/nl';
registerLocaleData(localeNl);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MenubarModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'nl' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
