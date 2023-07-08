import { renderHook, act } from '@testing-library/react';
import { useReducer } from 'react';
import reducer from './reducer';

describe('reducer', () => {
  it('returns the current state when it does not understand the action type', () => {
    const initialState = {
      fontName: 'Test Font',
      linkTags: [],
      requestedChars: new Set<string>(),
      onLoad: jest.fn(),
    };

    const { result } = renderHook(() => useReducer(reducer, initialState));

    //
    act(() => {
      // @ts-ignore Dispatch an action that the reducer does not understand.
      result.current[1]({ type: 'UNKNOWN_ACTION' });
    });

    // assert that state is unchanged
    expect(result.current[0]).toEqual(initialState);
  });
});
