import { NgModule } from '@angular/core';
import { ApiModule, Configuration, ConfigurationParameters } from 'ddOnlineHelperClient';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';

export function apiConfigFactory (): Configuration {
	let href = window.location.href;
	const params: ConfigurationParameters = {
basePath: href.substr(0, href.length-1) // remove trailing slash
	}
	return new Configuration(params);
}

@NgModule({
	declarations: [
		AppComponent,
		StartComponent
	],
	imports: [
		BrowserModule,
		ApiModule.forRoot(apiConfigFactory),
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
