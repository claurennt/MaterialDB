import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../globals';

test.describe('Home with Session', () => {
  test('should only show the Logout button after successful login', async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    const loginLink = page.getByRole('link', { name: 'Login' });
    const logoutLink = page.getByRole('link', { name: 'Logout' });

    await expect(logoutLink).toBeVisible();

    const registerLink = page.getByRole('link', { name: 'Register' });
    await expect(registerLink).not.toBeAttached();
    await expect(loginLink).not.toBeAttached();
  });

  test('should throw error if required name is missing or successfully add new topic if name is provided', async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    const addNewTopicButton = page.getByText('Add new topic');

    await expect(addNewTopicButton).toBeAttached();
    await addNewTopicButton.click();
    const modal = page.getByRole('dialog');

    await expect(modal).toBeVisible();

    const nameInput = page.getByLabel('name');
    const descriptionInput = page.getByLabel('description');
    await descriptionInput.fill('test-description');

    const submit = page.getByRole('button', { name: 'Add topic' });
    await submit.click();

    const errorFeedback = page.getByText('🛑 Name is required');
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAccessibleDescription('Name is required');

    expect(errorFeedback).toBeAttached();
    await nameInput.fill('test-topic');

    await submit.click();

    expect(nameInput).toHaveAttribute('aria-invalid', 'false');
    expect(nameInput).toHaveAccessibleDescription('');
    expect(errorFeedback).not.toBeAttached();

    const newlyAddedTopic = page
      .getByRole('link', {
        name: 'test-topic test-description',
      })
      .last();

    await expect(newlyAddedTopic).toBeAttached();
  });

  test('should navigate to the individual topic page on card click', async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    const topicCard = page
      .getByRole('link', { name: /test-topic test-description/i })
      .first();

    await expect(topicCard).toBeVisible();
    await topicCard.click();

    const expectedUrlPattern = new RegExp(
      `^${BASE_URL.replace(/\./g, '\\.')}/topics/.*name=test-topic`,
      'i',
    );

    await expect(page).toHaveURL(expectedUrlPattern, { timeout: 10000 });
  });
});
