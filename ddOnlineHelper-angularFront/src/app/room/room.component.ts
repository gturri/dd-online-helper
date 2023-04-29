import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, transition, animate, style, keyframes} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { DefaultService, ApiLastEventsGet200ResponseInner} from 'ddOnlineHelperClient';
import { CoordinateService } from '../coordinate.service';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css'],
	animations: [
		trigger('newMessage', [
			transition(':enter', [
				style({backgroundColor: 'yellow'}),
				animate('3000ms', keyframes([
					style({opacity:0}),
					style({opacity:1}),
					style({backgroundColor:'yellow'}),
					style({backgroundColor: 'inherit'})
				]))
			])
		])
	]
})
export class RoomComponent implements OnInit, OnDestroy {
	events: Array<ApiLastEventsGet200ResponseInner> = [];
	timeoutId = 0;
	room = "";
	lastEventId = -1;
	firstMessagesAlreadyRetrieved = false;
	firstMessagesAlreadyDisplayed = false;


	constructor(
			private http: DefaultService,
			private coordinateService: CoordinateService,
			private route: ActivatedRoute,
			private router: Router
			) { }

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
		console.log("[" + Date.now() + "] Going to fetch events for room " + this.room);
		let obs: Observable<Array<ApiLastEventsGet200ResponseInner>> = this.http.apiLastEventsGet(this.room);
		let self = this;
		obs.subscribe({
				next(events) {
					if (!self.firstMessagesAlreadyRetrieved) {
						self.firstMessagesAlreadyRetrieved = true;
						self.events = events;
						self.events.forEach((ev) => self.lastEventId = Math.max(self.lastEventId, ev.id));
					} else {
						self.firstMessagesAlreadyDisplayed = true; // Activate the animations for messages displayed
						let lastEventId = self.lastEventId;
						events.forEach((ev) => {
								self.lastEventId = Math.max(self.lastEventId, ev.id);
						});
						// Don't do "self.events = events" otherwise existing messages will be re-created, which
						// will trigger the :enter animation even for existing messages
						self.events = events.filter((ev) => ev.id > lastEventId).concat(self.events);
					}

					self.scheduleNewGetEvents();
				},
				error(err) {
					console.error("Failed to get data: " + err);
					self.scheduleNewGetEvents();
				}
		});
	}


	scheduleNewGetEvents() {
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(() => {this.getEvents()}, 1000);
	}
}
