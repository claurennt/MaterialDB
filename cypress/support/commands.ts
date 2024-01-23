/// <reference types="cypress" />

import { mount } from 'cypress/react';
import * as NextRouter from 'next/router';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      mountWithRouter: (params?: { query?: { userId?: string } }) => Cypress.cy;
    }
  }
}
