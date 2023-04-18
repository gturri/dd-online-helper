import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoordinateService {
	player: string = "";

  constructor() { }

	getPlayer() {
		return this.player;
	}
	setPlayer(player: string) {
		this.player = player;
	}
}
