/// <reference types="cypress" />

import React from 'react';
import Subtitle from '../../components/Subtitle';
import { SessionProvider } from 'next-auth/react';

import { Session } from 'next-auth';

describe('<Subtitle />', () => {
  it('should instruct the user if session is present', () => {
    const setOpen = cy.stub().as('setOpen');
    cy.mountWithRouter();
    // Load the fixture
    cy.fixture('session').then((session: Session) => {
      // Mount the component with the SessionProvider
      cy.mount(
        <SessionProvider session={session}>
          <Subtitle setOpen={setOpen} />
        </SessionProvider>
      );

      // Assert the rendered content
      cy.contains('Start adding new topics to your collection!');
    });
  });

  it('should render a general description with no session', () => {
    const setOpen = cy.stub().as('setOpen');
    const session = null;

    cy.mountWithRouter();
    // Mount the component with the SessionProvider
    cy.mount(
      <SessionProvider session={session}>
        <Subtitle setOpen={setOpen} />
      </SessionProvider>
    );

    // Assert the rendered content
    cy.contains(
      'MaterialDB is an app where you can collect useful links and resources that help you become a better developer/instructor'
    );
  });
  it('should instruct to pick topics when userId is defined', () => {
    const setOpen = cy.stub().as('setOpen');
    const session = null;

    cy.mountWithRouter();
    // Mount the component with the SessionProvider
    cy.mount(
      <SessionProvider session={session}>
        <Subtitle setOpen={setOpen} />
      </SessionProvider>
    );

    // Assert the rendered content
    cy.contains('If you wanna see a list of resources pick a topic below');
  });
  it('should not show text when userId is not defined', () => {
    const setOpen = cy.stub().as('setOpen');
    const session = null;

    cy.mountWithRouter({ query: { userId: undefined } });

    // Mount the component with the SessionProvider
    cy.mount(
      <SessionProvider session={session}>
        <Subtitle setOpen={setOpen} />
      </SessionProvider>
    );

    // Assert the rendered content
    cy.contains(
      'If you wanna see a list of resources pick a topic below'
    ).should('not.exist');
  });
});
