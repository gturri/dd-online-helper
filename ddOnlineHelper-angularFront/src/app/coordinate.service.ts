import { Injectable } from '@angular/core';

/**
 * This service:
 * - persists the data in localStorage so a known user who re-opens a page in her browser doesn't necessarily
 *   has to enter her name again
 * - but after initialization it relies only on the value in ram so that if the users opens another page
 *   in her browser with another name, that won't impact the current page
 */
@Injectable({
  providedIn: 'root'
})
export class CoordinateService {
	readonly playerKey = "player";
	player: string | null;

	constructor() {
		this.player = window.localStorage.getItem(this.playerKey);
	}

	getPlayer(): string | null {
		return this.player
	}
	setPlayer(player: string) {
		window.localStorage.setItem(this.playerKey, player);
		this.player = player;
	}
}
