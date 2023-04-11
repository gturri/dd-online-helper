import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DefaultService, LastEventsGet200ResponseInner, DicePostRequest } from 'ddOnlineHelperClient';
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

	rollForm = this.formBuilder.group({
		numberOfDice: '',
		numberOfSides: ''
	});

	constructor(private http: DefaultService, private formBuilder: FormBuilder) {
		this.client = http;
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
			room: "myroom",
			player: "toto",
			dice: [{
				numberOfDice: parseInt(formValues.numberOfDice),
				numberOfSides: parseInt(formValues.numberOfSides)
			}]
		};
		let obs: Observable<any> = this.client.dicePost(payload);
		let self = this;
		obs.subscribe({
			next(resp) {
				console.log("successfully rolled the dice");
				// TODO: reload messages asap
				self.rollForm.reset();
			},
			error(err) {
				console.error("Failed to roll the dice", err);
				alert("Failed to roll the dice (you may want to retry)");
			}
		});
	}

	getEvents() {
		console.log("tempGT: in getData");
		let obs: Observable<Array<LastEventsGet200ResponseInner>> = this.client.lastEventsGet("myroom");
		let self = this;
		obs.subscribe({
				next(events) {
					self.events = events
					setTimeout(() => {self.getEvents()}, 1000);
				},
				error(err) {
					console.error("Failed to get data: " + err);
					setTimeout(() => {self.getEvents()}, 1000);
				}
		});
	}
}
