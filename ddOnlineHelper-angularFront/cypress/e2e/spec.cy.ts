describe('template spec', () => {
	it('passes', () => {
		cy.visit('http://localhost:4200')
		cy.get("#player").type("toto");
		cy.get("#room").type("myroom");
		cy.get(".button").click();

		cy.contains("toto");
		cy.contains("myroom");
	})
})
