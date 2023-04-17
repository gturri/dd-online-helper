import { NgModule } from '@angular/core';
import { ApiModule, Configuration, ConfigurationParameters } from 'ddOnlineHelperClient';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { WelcomeComponent } from './welcome/welcome.component';

export function apiConfigFactory (): Configuration {
	let host = window.location.host;
	let protocol = window.location.protocol;
	const params: ConfigurationParameters = {
		basePath: protocol + "//" + host
	}
	return new Configuration(params);
}

@NgModule({
	declarations: [
		AppComponent,
		RoomComponent,
		WelcomeComponent
	],
	imports: [
		BrowserModule,
		ApiModule.forRoot(apiConfigFactory),
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forRoot([
			{ path: '', component: WelcomeComponent},
			{ path: 'room', component: RoomComponent},
		])
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
