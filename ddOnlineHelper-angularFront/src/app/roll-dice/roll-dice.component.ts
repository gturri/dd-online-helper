import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DefaultService } from '../generated/api/default.service';
import { ApiDicePostRequest } from '../generated/model/apiDicePostRequest';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CoordinateService } from '../coordinate.service';

@Component({
	selector: 'app-roll-dice',
	templateUrl: './roll-dice.component.html',
	styleUrls: ['./roll-dice.component.css']
})
export class RollDiceComponent {
	@Input() room!: string;
	@Output() needToReloadEventsNotification = new EventEmitter();
	rollFormBeingProcessed = false;

	rollForm = this.formBuilder.group({
		numberOfDice: '1',
		numberOfSides: '6'
	});

	player: string = "";

	constructor(
			private http: DefaultService,
			private formBuilder: FormBuilder,
			private coordinateService: CoordinateService,
			private router: Router
			) {
		const player = coordinateService.getPlayer();
		if ( ! player ) {
			console.log("Unknown player, we're going to main page.");
			this.navigateToMainPage();
		} else {
			this.player = player;
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
		let payload: ApiDicePostRequest = {
			room: this.room,
			player: this.player,
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
				self.needToReloadEventsNotification.emit();
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

}
