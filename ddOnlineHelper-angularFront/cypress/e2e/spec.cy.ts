describe('template spec', () => {
	it('Can go to a room as a player', () => {
		//test
		cy.visit('')
		isWelcomePage(cy);

		moveToRoomAsPlayer(cy, "toto", "myroom");
		cy.get('[data-cy="player"]').contains('toto');
		cy.get('[data-cy="room"]').contains('myroom');
	}),

	it('Is redirected to welcome page if player is unknown', () => {
		cy.visit('/room/myroom')
		isWelcomePage(cy);
	}),

	it('Can go directly to any room if user is already known', () => {
		cy.visit('');
		moveToRoomAsPlayer(cy, "titi", "myroom");

		cy.visit('/room/anyroom');
		cy.contains("titi");
		cy.contains("anyroom");
	})

	it('Has player field pre-filled on welcome page if user is already known', () => {
		cy.visit('');
		// Pre-condition
		cy.get('[data-cy="player"]').should('not.have.value', 'titi');
		moveToRoomAsPlayer(cy, "titi", "myroom");

		cy.visit('');
		cy.get('[data-cy="player"]').should('have.value', 'titi');
	})
})

function isWelcomePage(cy) {
	cy.url().should('equal', cy.config("baseUrl") + "/");
	cy.get("#player");
	cy.get("#room");
}

function moveToRoomAsPlayer(cy, player: string, room: string) {
	cy.get('[data-cy="player"]').type(player);
	cy.get('[data-cy="room"]').type(room);
	cy.get('[data-cy="submit"]').click();
}
