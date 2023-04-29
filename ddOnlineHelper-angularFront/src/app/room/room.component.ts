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
			state('closed', style({
				opacity: 0,
			})),
			state('open', style({
				opacity: 'inherit',
			})),
			transition('closed => open', [animate('500ms')])
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
					self.newEvents = [];
					events.forEach((ev) => {
						if ( ev.id > self.lastEventId ) {
							self.newEvents.push(ev);
						}
						maxId = Math.max(ev.id, maxId);
					});
					self.lastEventId = maxId;
					if (self.newEvents.length != 0 && self.firstMessagesAlreadyDisplayed) {
						console.log("[" + Date.now() + "] got " + self.newEvents.length + " new events");
						self.displayedNewMessages = false;
						setTimeout(() => {self.displayNewMessages()}, 1);
					} else {
						console.log("[" + Date.now() + "] got no new events (or it's the first time we get messages)");
						self.events = events;
						self.scheduleNewGetEvents();
					}
					self.firstMessagesAlreadyDisplayed = true;
				},
				error(err) {
					console.error("Failed to get data: " + err);
					self.scheduleNewGetEvents();
				}
		});
	}

	displayNewMessages() {
		console.log("[" + Date.now() + "] going to display the new messages");
		if (this.displayedNewMessages) {
			console.error("called displayNewMessages but this.displayedNewMessages is already true");
		}
		this.displayedNewMessages = true;
		setTimeout(() => {
		console.log("[" + Date.now() + "] new messages have been displayed");
			this.events = this.newEvents.concat(this.events);
			this.newEvents = [];
			this.scheduleNewGetEvents(); //TODO: it should be scheduled to start immediately
		}, 1000);
	}

	scheduleNewGetEvents() {
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(() => {this.getEvents()}, 1000);
	}
}
