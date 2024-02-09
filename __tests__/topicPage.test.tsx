/**
 * @jest-environment node
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../utils/test/mocks';
import '@models';

// import { renderWithSession, renderWithoutSession } from '@utils/test/helpers';

import TopicPage from '../pages/topics/[_id]';
import { useRouter } from 'next/router';

const setOpenMock = jest.fn();

const mockTopic = {
  title: 'test-title',
  url: 'test-url',
  tags: ['tag1'],
  _id: '300',
  category: 'test-category',
  links: ['link1'],
};

const individualTopicId = '2';
beforeEach(() => {
  setOpenMock.mockReset();
});

describe('TopicPage', () => {
  it('should render correct text with session', async () => {
    // const jws = TopicPage({ individualTopic: mockTopic }) as React.ReactElement;
    // const { getByText } = render(jws);
    // // renderWithSession(<TopicPage individualTopic={individualTopicId} />);
    // expect(useRouter().query.name).not.toBeNull();
  });
});
