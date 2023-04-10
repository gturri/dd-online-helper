import { NgModule } from '@angular/core';
import { ApiModule, Configuration, ConfigurationParameters } from 'ddOnlineHelperClient';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

export function apiConfigFactory (): Configuration {
  let href = window.location.href;
  const params: ConfigurationParameters = {
    basePath: href.substr(0, href.length-1) // remove trailing slash
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
