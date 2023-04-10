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
	data: Array<LastEventsGet200ResponseInner>;

	constructor(private http: DefaultService) {
		this.client = http;
		this.data = [];
		this.getData();
	}

	getData() {
		console.log("tempGT: in getData");
		let obs: Observable<Array<LastEventsGet200ResponseInner>> = this.client.lastEventsGet("myroom");
		obs.subscribe(data => {
				this.data = data;
				console.log("tempGT: got " + data);
				setTimeout(() => {this.getData()}, 1000);

		});
	}
}
