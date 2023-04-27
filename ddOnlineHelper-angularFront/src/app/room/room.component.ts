import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { DefaultService } from '../generated/api/default.service';
import { ApiLastEventsGet200ResponseInner} from '../generated/model/apiLastEventsGet200ResponseInner'
import { CoordinateService } from '../coordinate.service';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {
	events: Array<ApiLastEventsGet200ResponseInner>;
	timeoutId = 0;
	room = "";

	constructor(
			private http: DefaultService,
			private coordinateService: CoordinateService,
			private route: ActivatedRoute,
			private router: Router
			) {
		this.events = [];
	}

	ngOnInit() {
		const room = this.route.snapshot.paramMap.get('roomId');
		if ( ! room ) {
			// This should never occur because of how the router is setup,
			// however angular requires that we handle this case.
			// Anyway it probably makes sense to handle that case so this component works well
			// even if we change the router rules in the future
			console.error("unknown roomId. This should never occur. We're going to main page.");
			this.navigateToMainPage();
		} else {
			this.room = room;
			this.getEvents();
		}
	}

	ngOnDestroy() {
		clearTimeout(this.timeoutId);
	}

	navigateToMainPage() {
			this.router.navigate(['']);
	}

	getEvents() {
		clearTimeout(this.timeoutId);
		console.log("Going to fetch events for room " + this.room);
		let obs: Observable<Array<ApiLastEventsGet200ResponseInner>> = this.http.apiLastEventsGet(this.room);
		let self = this;
		obs.subscribe({
				next(events) {
					self.events = events
					self.timeoutId = window.setTimeout(() => {self.getEvents()}, 1000);
				},
				error(err) {
					console.error("Failed to get data: " + err);
					self.timeoutId = window.setTimeout(() => {self.getEvents()}, 1000);
				}
		});
	}
}
