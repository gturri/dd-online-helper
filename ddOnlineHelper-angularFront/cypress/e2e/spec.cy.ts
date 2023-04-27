describe('template spec', () => {
	it('Can go to a room as a player, get the existing messages and then get subsequent new messages', () => {
		// Setup
		cy.intercept({
			method: 'GET',
			url: '/api/last-events?room=myroom*'
		},
		[
			{id: 666, timestamp: '1682511215', text: 'some message'},
			{id: 667, timestamp: '1682511216', text: 'some other message'},
			{id: 668, timestamp: '1682511217', text: 'third message'},
		]).as('subsequentQueriesToGetMessages');

		cy.intercept({
			method: 'GET',
			url: '/api/last-events?room=myroom*',
			times: 1
		},
		[
			{id: 666, timestamp: '1682511215', text: 'some message'},
			{id: 667, timestamp: '1682511216', text: 'some other message'},
		]).as('firstQueryToGetMessages');

		cy.clock();

		//test
		cy.visit('')
		cy.isWelcomePage();

		cy.moveToRoomAsPlayer("toto", "myroom");
		cy.get('[data-cy="player"]').should('have.text', 'toto');
		cy.get('[data-cy="room"]').should('have.text', 'myroom');

		cy.wait("@firstQueryToGetMessages");
		cy.get('[data-cy="messages"] tbody tr').should(($messages) => {
			expect($messages).to.have.length(2)
			expect($messages.eq(0)).to.contain('some message')
			expect($messages.eq(1)).to.contain('some other message')
		})

		cy.tick(1001);
		cy.wait("@subsequentQueriesToGetMessages");
		cy.get('[data-cy="messages"] tbody tr').should(($messages) => {
			expect($messages).to.have.length(3)
			expect($messages.eq(0)).to.contain('some message')
			expect($messages.eq(1)).to.contain('some other message')
			expect($messages.eq(2)).to.contain('third message')
		})
	}),

	it('Is redirected to welcome page if player is unknown', () => {
		cy.visit('/room/myroom')
		cy.isWelcomePage();
	}),

	it('Can go directly to any room if user is already known', () => {
		cy.visit('');
		cy.moveToRoomAsPlayer("titi", "myroom");

		cy.visit('/room/anyroom');
		cy.get('[data-cy="player"]').should('have.text', 'titi');
		cy.get('[data-cy="room"]').should('have.text', 'anyroom');
	})

	it('Has player field pre-filled on welcome page if user is already known', () => {
		cy.visit('');
		// Pre-condition
		cy.get('[data-cy="player"]').should('not.have.value', 'titi');
		cy.moveToRoomAsPlayer("titi", "myroom");

		cy.visit('');
		cy.get('[data-cy="player"]').should('have.value', 'titi');
	})

	it('reloads messages even after a query to the server failed', () => {
		// Setup
		cy.intercept({
			method: 'GET',
			url: '/api/last-events?room=myroom*',
		},[
			{id: 666, timestamp: '1682511215', text: 'some message'},
		]).as('subsequentSuccessfulCalls');
		cy.intercept({
			method: 'GET',
			url: '/api/last-events?room=myroom*',
			times: 1,
		}, {statusCode: 500}).as('forcedError');

		cy.clock();

		// Test
		cy.visit('');
		cy.moveToRoomAsPlayer("toto", "myroom");

		cy.wait('@forcedError');
		cy.get('[data-cy="messages"] tbody tr').should('have.length', 0);

		cy.tick(1001);
		cy.wait('@subsequentSuccessfulCalls');
		cy.get('[data-cy="messages"] tbody tr').should('have.length', 1);
	});
})
