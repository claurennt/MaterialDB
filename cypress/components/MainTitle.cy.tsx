import React from 'react';
import MainTitle from '../../components/MainTitle';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

describe('<MainTitle />', () => {
  it('should render the user name when there is a session', () => {
    // Load the fixture
    cy.fixture('session').then((session: Session) => {
      // Mount the component with the SessionProvider
      cy.mount(
        <SessionProvider session={session}>
          <MainTitle />
        </SessionProvider>
      );

      // Assert the rendered content
      cy.get('h1').should(
        'have.text',
        `Welcome back to your MaterialDB ${session.user!.name}!`
      );
    });
  });

  it('should only say hello without a session', () => {
    const session = null;

    // Mount the component with the SessionProvider
    cy.mount(
      <SessionProvider session={session}>
        <MainTitle />
      </SessionProvider>
    );

    // Assert the rendered content
    cy.get('h1').should('have.text', 'Welcome to MaterialDB!');
  });
});
