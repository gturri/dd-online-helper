import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoordinateService {
	room: string = "myroom";
	player: string = "titi";

  constructor() { }

	getPlayer() {
		return this.player;
	}
	setPlayer(player: string) {
		this.player = player;
	}

	getRoom() {
		return this.room;
	}
	setRoom(room: string) {
		this.room = room;
	}
}
