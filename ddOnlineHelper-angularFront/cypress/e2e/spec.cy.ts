const server = "http://localhost:4200";
describe('template spec', () => {
	it('Can go to a room as a player', () => {
		cy.visit(server)
		isWelcomePage(cy);

		moveToRoomAsPlayer(cy, "toto", "myroom");
		cy.contains("toto");
		cy.contains("myroom");
	}),

	it('Is redirected to welcome page if player is unknown', () => {
		cy.visit(server + '/room/myroom')
		isWelcomePage(cy);
	})
})

function isWelcomePage(cy) {
	cy.url().should('equal', server + "/");
	cy.get("#player");
	cy.get("#room");
}

function moveToRoomAsPlayer(cy, player: string, room: string) {
	cy.get("#player").type(player);
	cy.get("#room").type(room);
	cy.get(".button").click();
}
