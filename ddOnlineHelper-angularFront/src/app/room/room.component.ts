import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { DefaultService, LastEventsGet200ResponseInner, DicePostRequest } from 'ddOnlineHelperClient';
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
	events: Array<LastEventsGet200ResponseInner>;
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
	}

	ngOnInit() {
		const room = this.route.snapshot.paramMap.get('roomId');
		if ( ! room ) {
			this.router.navigate(['']);
		} else {
			this.room = room;
			this.getEvents();
		}
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
		let payload: DicePostRequest = {
			room: this.room,
			player: this.coordinateService.getPlayer(),
			dice: [{
				numberOfDice: parseInt(formValues.numberOfDice),
				numberOfSides: parseInt(formValues.numberOfSides)
			}]
		};
		let obs: Observable<any> = this.http.dicePost(payload);
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
		let obs: Observable<Array<LastEventsGet200ResponseInner>> = this.http.lastEventsGet(this.room);
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
