import {
  addNewResource,
  deleteResource,
  formReducer,
  highlightSearchTerm,
  isTopic,
} from '..';

import '@testing-library/jest-dom';

import { getAxiosClient } from '../../server/axios';

// Mock getAxiosClient
jest.mock('utils/server/axios', () => ({
  getAxiosClient: jest.fn(),
}));

describe('helpers', () => {
  describe('isTopicState', () => {
    it('should return true when "name" is present in the state', () => {
      const state = { name: 'Topic Name', description: 'Topic Description' };
      const result = isTopic(state);
      expect(result).toBe(true);
    });
    it('should return true when "name" is not present in the state', () => {
      const state = {};
      const result = isTopic(state);
      expect(result).toBe(false);
    });
  });
  describe('highlightSearch', () => {
    // highlights all occurrences of the search term in the title
    it('should highlight all occurrences of the search term in the title', () => {
      const searchTerm = 'test';
      const title = 'This is a test. Testing is important.';
      const result = highlightSearchTerm(searchTerm, title);
      expect(result.__html).toBe(
        'This is a <mark>test</mark>. <mark>Test</mark>ing is important.'
      );
    });
    // search term not found in the title
    it('should return the original title when the search term is not found', () => {
      const searchTerm = 'notfound';
      const title = 'This is a test. Testing is important.';
      const result = highlightSearchTerm(searchTerm, title);
      expect(result.__html).toBe('This is a test. Testing is important.');
    });
  });
  describe('formReducer', () => {
    // Updates state with new topic when action type is 'SET_NEW_TOPIC'
    it('should update state with correct action', () => {
      const initialState = {
        newTopic: '',
        newLink: '',
        tagValue: '',
        isError: false,
        isLoading: false,
      };

      //SET_NEW_TOPIC
      const action = { type: 'SET_NEW_TOPIC', payload: 'New Topic' };
      const newState = formReducer(initialState, action);
      expect(newState.newTopic).toBe('New Topic');

      //SET_NEW_LINK
      const action2 = { type: 'SET_NEW_LINK', payload: 'New Link' };
      const newState2 = formReducer(initialState, action2);
      expect(newState2.newLink).toBe('New Link');

      //SET_TAG_VALUE
      const action3 = { type: 'SET_TAG_VALUE', payload: 'New Tag' };
      const newState3 = formReducer(initialState, action3);
      expect(newState3.tagValue).toBe('New Tag');

      //SET_ERROR
      const action4 = { type: 'SET_ERROR', payload: true };
      const newState4 = formReducer(initialState, action4);
      expect(newState4.isError).toBe(true);

      //SET_LOADING
      const action5 = { type: 'SET_LOADING', payload: false };
      const newState5 = formReducer(initialState, action5);
      expect(newState5.isLoading).toBe(false);
    });
    it('should return current state when action type is unrecognized', () => {
      const initialState = {
        newTopic: '',
        newLink: '',
        tagValue: '',
        isError: false,
        isLoading: false,
      };
      const action = { type: 'UNKNOWN_ACTION', payload: 'Some Payload' };
      const newState = formReducer(initialState, action);
      expect(newState).toBe(initialState);
    });

    // Validates that reducer handles rapid consecutive actions correctly
    it('should update state with new topic when action type is "SET_NEW_TOPIC"', () => {
      const initialState = {
        newTopic: '',
        newLink: '',
        tagValue: '',
        isError: false,
        isLoading: false,
      };
      const action1 = { type: 'SET_NEW_TOPIC', payload: 'New Topic 1' };
      const action2 = { type: 'SET_NEW_TOPIC', payload: 'New Topic 2' };
      const newState1 = formReducer(initialState, action1);
      const finalState = formReducer(newState1, action2);
      expect(finalState.newTopic).toBe('New Topic 2');
    });
  });

  describe('addNewResource', () => {
    let mockEvent;
    const mockToken = 'mock-token';
    const mockEndpoint = '/api/resource/1234';
    beforeEach(() => {
      mockEvent = {
        preventDefault: jest.fn(), // Mock preventDefault function
      };
    });

    it('should call PUT endpoint for NewLink payload', async () => {
      // Mock payload and AxiosClient.put
      const mockPayload = {
        url: 'http://example.com',
        tags: ['tag1'],
        _topic: '1234',
      };

      const mockPut = jest.fn().mockResolvedValue({ data: 'put response' });
      const mockAxiosClient = { put: mockPut };
      (getAxiosClient as jest.Mock).mockReturnValue(mockAxiosClient);

      const response = await addNewResource(mockEvent, mockToken, mockPayload);

      // Assert event.preventDefault was called
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      // Assert AxiosClient.put was called with correct endpoint and payload
      expect(mockPut).toHaveBeenCalledWith('/api/topics/1234', mockPayload);

      // Assert the response is correct
      expect(response).toEqual({ data: 'put response' });
    });

    it('should call POST endpoint for NewTopic payload', async () => {
      // Mock payload and AxiosClient.post
      const mockPayload = {
        name: 'New Topic',
        description: 'A description',
      };

      const mockPost = jest.fn().mockResolvedValue({ data: 'post response' });
      const mockAxiosClient = { post: mockPost };
      (getAxiosClient as jest.Mock).mockReturnValue(mockAxiosClient);

      const response = await addNewResource(mockEvent, mockToken, mockPayload);

      // Assert event.preventDefault was called
      expect(mockEvent.preventDefault).toHaveBeenCalled();

      // Assert AxiosClient.post was called with correct endpoint and payload
      expect(mockPost).toHaveBeenCalledWith('/api/topics/', mockPayload);

      // Assert the response is correct
      expect(response).toEqual({ data: 'post response' });
    });

    it('should call DELETE endpoint with correct parameters', async () => {
      const mockDelete = jest.fn().mockResolvedValue({ data: 'deleted' });
      const mockAxiosClient = { delete: mockDelete };
      (getAxiosClient as jest.Mock).mockReturnValue(mockAxiosClient);

      await deleteResource(mockToken, mockEndpoint);

      // Assert AxiosClient.delete was called with correct endpoint
      expect(mockDelete).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should log error when delete fails', async () => {
      const mockError = new Error('Delete failed');
      const mockDelete = jest.fn().mockRejectedValue(mockError);
      const mockAxiosClient = { delete: mockDelete };
      (getAxiosClient as jest.Mock).mockReturnValue(mockAxiosClient);

      console.log = jest.fn(); // Spy on console.log

      await deleteResource(mockToken, mockEndpoint);

      // Assert console.log was called with the error
      expect(console.log).toHaveBeenCalledWith(mockError);
    });
  });
});
