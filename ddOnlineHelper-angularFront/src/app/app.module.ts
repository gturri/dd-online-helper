import { NgModule, isDevMode } from '@angular/core';
import { ApiModule } from './generated/api.module';
import { Configuration, ConfigurationParameters } from './generated/configuration';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RollDiceComponent } from './roll-dice/roll-dice.component';
import { ServiceWorkerModule } from '@angular/service-worker';

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
		WelcomeComponent,
		RollDiceComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
		ApiModule.forRoot(apiConfigFactory),
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forRoot([
			{ path: 'room/:roomId', component: RoomComponent},
			{ path: '**', component: WelcomeComponent},
		]),
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: !isDevMode(),
    // Register the ServiceWorker as soon as the application is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  }),
  RouterModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
