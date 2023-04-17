import { Component } from '@angular/core';
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
export class RoomComponent {
	events: Array<LastEventsGet200ResponseInner>;
	rollFormBeingProcessed = false;

	rollForm = this.formBuilder.group({
		numberOfDice: '',
		numberOfSides: ''
	});

	constructor(
			private http: DefaultService,
			private formBuilder: FormBuilder,
			private coordinateService: CoordinateService
			) {
		this.events = [];
		this.getEvents();
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
			room: this.coordinateService.getRoom(),
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
				// TODO: reload messages asap
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
		let obs: Observable<Array<LastEventsGet200ResponseInner>> = this.http.lastEventsGet(this.coordinateService.getRoom());
		let self = this;
		obs.subscribe({
				next(events) {
					self.events = events
					setTimeout(() => {self.getEvents()}, 10000);
				},
				error(err) {
					console.error("Failed to get data: " + err);
					setTimeout(() => {self.getEvents()}, 1000);
				}
		});
	}
}
