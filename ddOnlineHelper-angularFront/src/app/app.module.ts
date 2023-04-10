import { NgModule } from '@angular/core';
import { ApiModule, Configuration, ConfigurationParameters } from 'ddOnlineHelperClient';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

export function apiConfigFactory (): Configuration {
  const params: ConfigurationParameters = {
    basePath: "http://localhost:8000"
  }
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ApiModule.forRoot(apiConfigFactory),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
