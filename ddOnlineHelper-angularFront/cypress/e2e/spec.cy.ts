const server = "http://localhost:4200";
describe('template spec', () => {
	it('Can go to a room as a player', () => {
		cy.visit(server)
		isWelcomePage(cy);

		moveToRoomAsPlayer(cy, "toto", "myroom");
		cy.get('[data-cy="player"]').contains('toto');
		cy.get('[data-cy="room"]').contains('myroom');
	}),

	it('Is redirected to welcome page if player is unknown', () => {
		cy.visit(server + '/room/myroom')
		isWelcomePage(cy);
	}),

	it('Can go directly to any room if user is already known', () => {
		cy.visit(server);
		moveToRoomAsPlayer(cy, "titi", "myroom");

		cy.visit(server + '/room/anyroom');
		cy.contains("titi");
		cy.contains("anyroom");
	})

	it('Has player field pre-filled on welcome page if user is already known', () => {
		cy.visit(server);
		// Pre-condition
		cy.get('[data-cy="player"]').should('not.have.value', 'titi');
		moveToRoomAsPlayer(cy, "titi", "myroom");

		cy.visit(server);
		cy.get('[data-cy="player"]').should('have.value', 'titi');
	})
})

function isWelcomePage(cy) {
	cy.url().should('equal', server + "/");
	cy.get("#player");
	cy.get("#room");
}

function moveToRoomAsPlayer(cy, player: string, room: string) {
	cy.get('[data-cy="player"]').type(player);
	cy.get('[data-cy="room"]').type(room);
	cy.get('[data-cy="submit"]').click();
}
