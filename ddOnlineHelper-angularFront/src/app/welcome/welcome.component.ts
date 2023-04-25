import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CoordinateService } from '../coordinate.service';

@Injectable()
@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
	welcomeForm = this.formBuilder.group({
		player: this.coordinateService.getPlayer() ?? '',
		room: ''
	});

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private coordinateService: CoordinateService
	) { }

	onSubmit(): void {
		let formValues = this.welcomeForm.value;
		if (!formValues.player){
			alert("Player name must be filled");
			return;
		}
		if (!formValues.room){
			alert("Room must be filled");
			return;
		}

		this.coordinateService.setPlayer(formValues.player);
		this.router.navigate(['room', formValues.room]);
	}
}
