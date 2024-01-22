/// <reference types="cypress" />

import React from 'react';
import MainTitle from '../../components/MainTitle';
import { SessionProvider } from 'next-auth/react';

describe('<MainTitle />', () => {
  it('should render the user name when there is a session', () => {
    const session = {
      user: {
        name: 'Claudia',
        email: 'claudia@gmail.com',
        image: null,
      },
      expires: '3000-01-01T00:00:00.000Z',
    };

    cy.mount(
      <SessionProvider session={session}>
        <MainTitle />
      </SessionProvider>
    );
    cy.contains(`Welcome back to your MaterialDB ${session.user.name}!`);
  });

  it('should only say hello without a session', () => {
    cy.mount(
      <SessionProvider session={null}>
        <MainTitle />
      </SessionProvider>
    );
    cy.get('h1').should('have.text', 'Welcome to MaterialDB!');
  });
});
