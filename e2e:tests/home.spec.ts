import { test, expect } from '@playwright/test';
import { testWithSession } from './fixtures';
import { TESTUSER_ID } from './helpers';
import { BASE_URL } from '../globals';

test.describe('Home without Session', () => {
  test('should show the auth links and not show `Add New Topic` and `Logout` button when session is null', async ({
    page,
  }) => {
    await page.goto('.');

    const logoutButton = page.getByRole('button', { name: 'Logout' });
    const registerLink = page.getByRole('link', { name: 'Register' });
    const loginLink = page.getByRole('link', { name: 'Login' });
    const addNewTopicButton = page.getByRole('button', {
      name: 'Add new topic',
    });

    // assert that auth links are flex items and that the logout and add new topic button is not visible
    await expect(registerLink.locator('..')).toHaveCSS('display', 'flex');
    await expect(registerLink).toBeVisible();
    await expect(loginLink).toBeVisible();
    await expect(addNewTopicButton).not.toBeAttached();
    await expect(logoutButton).not.toBeAttached();
  });
  test('should show the auth button on the top right corner', async ({
    page,
  }) => {
    await page.goto(`.?userId=${TESTUSER_ID}`);

    const authLinksContainer = page
      .getByRole('link', { name: 'Register' })
      .locator('..'); // gets the parent of the target element

    // assert that auth links have position absolute, hence they are positioned in the top right corner of the page
    await expect(authLinksContainer).toHaveCSS('position', 'absolute');
  });
});

testWithSession.describe('Home with Session', () => {
  testWithSession(
    'should only show the Logout button after successful login',
    async ({ pageWithSession: page }) => {
      const loginLink = page.getByRole('link', { name: 'Login' });

      const logoutButton = page.getByRole('button', { name: 'Logout' });

      // assert that logout button is present now that user is logged in
      await expect(logoutButton).toBeVisible();

      const registerLink = page.getByRole('link', { name: 'Register' });

      // assert that auth links are not visible now that user is logged in
      await expect(registerLink).not.toBeAttached();
      await expect(loginLink).not.toBeAttached();
    }
  );
  testWithSession(
    'should successfully add new topic',
    async ({ pageWithSession: page }) => {
      const addNewTopicButton = page.getByRole('button', {
        name: 'Add new topic',
      });
      await expect(addNewTopicButton).toBeAttached();
      // open modal
      await addNewTopicButton.click();

      //  retrieve inputs
      const nameInput = page.getByLabel('name');
      const descriptionInput = page.getByLabel('description');

      // fill inputs
      await nameInput.fill('test-topic');
      await descriptionInput.fill('test-description');

      // submit request
      const submit = page.getByText('+');
      await submit.click();

      const newlyAddedTopic = page
        .getByRole('link', {
          name: 'test-topic test-description',
        })
        .last();

      await expect(newlyAddedTopic).toBeAttached();
    }
  );
  testWithSession(
    'should navigate to the individual topic page on card click',
    async ({ pageWithSession: page }) => {
      const topicToBeClicked = page
        .getByRole('link', {
          name: 'test-topic test-description',
        })
        .first();

      await expect(topicToBeClicked).toBeAttached();
      await topicToBeClicked.click();

      const urlPattern = new RegExp(
        `^${BASE_URL.replace(/\./g, '\\.')}/topics/.*\\?name=test-topic$` //ignores the topic id query param
      );

      // asserts that url starts with ${Base_URL}/topics and ends with ?name=test-topic
      await expect(page).toHaveURL(urlPattern);
    }
  );
});
