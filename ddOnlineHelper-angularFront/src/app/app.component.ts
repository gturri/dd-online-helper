import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DefaultService, LastEventsGet200ResponseInner } from 'ddOnlineHelperClient';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'ddOnlineHelper-angularFront';
	client: DefaultService;
	events: Array<LastEventsGet200ResponseInner>;

	constructor(private http: DefaultService) {
		this.client = http;
		this.events = [];
		this.getEvents();
	}

	getEvents() {
		console.log("tempGT: in getData");
		let obs: Observable<Array<LastEventsGet200ResponseInner>> = this.client.lastEventsGet("myroom");
		obs.subscribe(events => {
				this.events = events;
				setTimeout(() => {this.getEvents()}, 1000);

		});
	}
}
