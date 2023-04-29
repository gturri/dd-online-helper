import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, transition, animate, style} from '@angular/animations';
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
			state('open', style({opacity: 'inherit'})),
			transition('void => *', [
				style({opacity: 0}),
				animate('500ms')
			])
		])
	]
})
export class RoomComponent implements OnInit, OnDestroy {
	events: Array<ApiLastEventsGet200ResponseInner> = [];
	newEvents: Array<ApiLastEventsGet200ResponseInner> = [];
	timeoutId = 0;
	room = "";
	lastEventId = -1;
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
					let maxId = self.lastEventId;
					let newEvents: Array<ApiLastEventsGet200ResponseInner> = [];
					events.forEach((ev) => { // TODO: this loop is pointless in the case where self.firstMessagesAlreadyDisplayed is false (because in this case we should keep all events);
						if ( ev.id > self.lastEventId ) {
							newEvents.push(ev);
						}
						maxId = Math.max(ev.id, maxId);
					});
					self.lastEventId = maxId;
					if (!self.firstMessagesAlreadyDisplayed) {
						self.firstMessagesAlreadyDisplayed = true;
						self.events = newEvents;
						self.scheduleNewGetEvents();
					}
					else if (newEvents.length != 0) {
						self.newEvents = newEvents;
						console.log("[" + Date.now() + "] got " + self.newEvents.length + " new events");
						setTimeout(() => {self.displayNewMessages()}, 600);
					} else {
						console.log("[" + Date.now() + "] got no new events (or it's the first time we get messages)");
						self.scheduleNewGetEvents();
					}
				},
				error(err) {
					console.error("Failed to get data: " + err);
					self.scheduleNewGetEvents();
				}
		});
	}

	displayNewMessages() {
		console.log("[" + Date.now() + "] new messages have been displayed");
		this.events = this.newEvents.concat(this.events);
		this.newEvents = [];
		this.scheduleNewGetEvents(); //TODO: it should be scheduled to start immediately
	}

	scheduleNewGetEvents() {
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(() => {this.getEvents()}, 1000);
	}
}
