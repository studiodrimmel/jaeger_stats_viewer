import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppComponent } from "./app.component";
import { JaegerChartComponent } from './jaeger-chart/jaeger-chart.component';

@NgModule({
  declarations: [AppComponent, JaegerChartComponent],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
