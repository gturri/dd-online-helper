describe('template spec', () => {
	it('Can go to a room as a player', () => {
		// Setup
		cy.intercept({
			method: 'GET',
			url: '/api/last-events?room=myroom*',
		},
		[
			{id: 666, timestamp: '1682511215', text: 'some message'},
			{id: 667, timestamp: '1682511216', text: 'some other message'},
		]).as('getMessages');

		//test
		cy.visit('')
		isWelcomePage(cy);

		moveToRoomAsPlayer(cy, "toto", "myroom");
		cy.get('[data-cy="player"]').should('have.text', 'toto');
		cy.get('[data-cy="room"]').should('have.text', 'myroom');

		cy.wait("@getMessages");
		cy.get('[data-cy="message-0"]').contains('some message');
		cy.get('[data-cy="message-1"]').contains('some other message');
	}),

	it('Is redirected to welcome page if player is unknown', () => {
		cy.visit('/room/myroom')
		isWelcomePage(cy);
	}),

	it('Can go directly to any room if user is already known', () => {
		cy.visit('');
		moveToRoomAsPlayer(cy, "titi", "myroom");

		cy.visit('/room/anyroom');
		cy.get('[data-cy="player"]').should('have.text', 'titi');
		cy.get('[data-cy="room"]').should('have.text', 'anyroom');
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
