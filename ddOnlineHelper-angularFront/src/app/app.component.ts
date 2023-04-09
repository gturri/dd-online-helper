import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
	client: HttpClient;
	data: any;

	constructor(private http: HttpClient) {
		this.client = http;
		this.getData();
	}

	getData() {
		console.log("tempGT: in getData");
		this.client.get("/last-events?room=myroom")
			.subscribe(data => {
					this.data = data
					console.log("tempGT: got " + data);
					setTimeout(() => {this.getData()}, 1000);
					});

	}
}
