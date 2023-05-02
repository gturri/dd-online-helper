import { NgModule } from '@angular/core';
import { ApiModule } from './generated/api.module';
import { Configuration, ConfigurationParameters } from './generated/configuration';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AppComponent } from './app.component';
import { RoomComponent } from './room/room.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RollDiceComponent } from './roll-dice/roll-dice.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
		BrowserModule,
		ApiModule.forRoot(apiConfigFactory),
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forRoot([
			{ path: 'room/:roomId', component: RoomComponent},
			{ path: '**', component: WelcomeComponent},
		]),
	BrowserAnimationsModule,
	MatTableModule,
	MatAutocompleteModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
