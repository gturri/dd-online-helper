import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { DefaultService, ApiLastEventsGet200ResponseInner, ApiDicePostRequest } from 'ddOnlineHelperClient';
import { CoordinateService } from '../coordinate.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
	events: Array<ApiLastEventsGet200ResponseInner>;
	rollFormBeingProcessed = false;
	timeoutId = 0;
	room = "";

	rollForm = this.formBuilder.group({
		numberOfDice: '1',
		numberOfSides: '6'
	});

	constructor(
			private http: DefaultService,
			private formBuilder: FormBuilder,
			private coordinateService: CoordinateService,
			private route: ActivatedRoute,
			private router: Router
			) {
		this.events = [];
		if ( ! coordinateService.getPlayer() ) {
			// This may occur if the user put the direct url to this room in her browser
			console.log("Unknown player, we're going to main page.");
			this.navigateToMainPage();
		}
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

	navigateToMainPage() {
			this.router.navigate(['']);
	}

	onSubmit(): void {
		let formValues = this.rollForm.value;
		if (!formValues.numberOfDice){
			alert("Number of dice must be filled");
			return;
		}
		if (!formValues.numberOfSides){
			alert("Number of sides must be filled");
			return;
		}
		let player = this.coordinateService.getPlayer();
		if ( ! player ) {
			// We're trying to avoid letting unknown players in the room, but it could occur that the
			// user becomes unknown afterwards (eg: if the underlying storage is changed)
			console.log("unknown player tries to roll dice which is not allowed. Going to main page to identify the player");
			this.navigateToMainPage();
			return;
		}
		let payload: ApiDicePostRequest = {
			room: this.room,
			player: player,
			dice: [{
				numberOfDice: parseInt(formValues.numberOfDice),
				numberOfSides: parseInt(formValues.numberOfSides)
			}]
		};
		let obs: Observable<any> = this.http.apiDicePost(payload);
		this.rollFormBeingProcessed = true;
		let self = this;
		obs.subscribe({
			next(resp) {
				console.log("successfully rolled the dice");
				self.getEvents();
				self.rollForm.reset();
				self.rollFormBeingProcessed = false;
			},
			error(err) {
				self.rollFormBeingProcessed = false;
				console.error("Failed to roll the dice", err);
				alert("Failed to roll the dice (you may want to retry)");
			}
		});
	}

	getEvents() {
		clearTimeout(this.timeoutId);
		console.log("Going to fetch events for room " + this.room);
		let obs: Observable<Array<ApiLastEventsGet200ResponseInner>> = this.http.apiLastEventsGet(this.room);
		let self = this;
		obs.subscribe({
				next(events) {
					self.events = events
					self.timeoutId = setTimeout(() => {self.getEvents()}, 1000);
				},
				error(err) {
					console.error("Failed to get data: " + err);
					self.timeoutId = setTimeout(() => {self.getEvents()}, 1000);
				}
		});
	}
}
