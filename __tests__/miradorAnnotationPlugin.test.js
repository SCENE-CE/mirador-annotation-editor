import React from 'react';
import { useDispatch } from 'react-redux';

import { getWindowViewType } from 'mirador/dist/es/src/state/selectors';
import LocalStorageAdapter from '../src/annotationAdapter/LocalStorageAdapter';
import MiradorAnnotation from '../src/plugins/miradorAnnotationPlugin';
import { render, screen, fireEvent } from './test-utils';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
jest.mock('mirador/dist/es/src/state/selectors', () => ({
  getWindowViewType: jest.fn(),
}));

const defaultInitalState = {
  config: {
    annotation: {
      adapter: jest.fn(),
      exportLocalStorageAnnotations: true,
    },
  },
};

/** */
function createWrapper(props, initalState = defaultInitalState) {
  const mockT = jest.fn().mockImplementation((key) => key);

  return render(<MiradorAnnotation
    canvases={[]}
    TargetComponent={() => <div>hello</div>}
    targetProps={{ windowId: 'windowId' }}
    receiveAnnotation={jest.fn()}
    switchToSingleCanvasView={jest.fn()}
    annotationEditCompanionWindowIsOpened
    t={mockT}
    {...props}
  />, { preloadedState: initalState });
}

describe('MiradorAnnotation', () => {
  it('renders a create new button', () => {
    createWrapper();
    const button = screen.getByRole('button', { name: /create_annotation/i });
    expect(button).toBeInTheDocument();
  });

  it('opens a new companionWindow when clicked', () => {
    const mockDispatch = jest.fn();
    useDispatch.mockImplementation(() => mockDispatch);

    getWindowViewType.mockReturnValue('single');
    createWrapper({});

    const button = screen.getByRole('button', { name: /create_annotation/i });
    fireEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction).toEqual(
      expect.objectContaining({
        payload: expect.objectContaining({
          content: 'annotationCreation',
          position: 'right',
        }),
        type: 'mirador/ADD_COMPANION_WINDOW',
        windowId: 'windowId',
      }),
    );
  });

  it('opens single canvas view dialog if not in single view', () => {
    getWindowViewType.mockReturnValue('book');
    createWrapper();

    expect(screen.queryByText('switch_view')).toBeNull();

    const button = screen.getByRole('button', { name: /create_annotation/i });
    fireEvent.click(button);

    expect(screen.queryByText('switch_view')).toBeInTheDocument();
  });

  it('renders no export button if export or LocalStorageAdapter are not configured', () => {
    // eslint-disable-next-line max-len
    const stateWithoutLocalAdapter = { config: { annotation: { adapter: () => () => {}, exportLocalStorageAnnotations: true } } };
    createWrapper({}, stateWithoutLocalAdapter);
    const button = screen.queryByText(/Export local annotations for visible items/i);
    expect(button).toBeNull();

    const annotation = {
      adapter: () => () => {}, exportLocalStorageAnnotations: false,
    };

    const stateWithFalsyExport = { config: annotation };
    createWrapper({}, stateWithFalsyExport);
    const button2 = screen.queryByText(/Export local annotations for visible items/i);
    expect(button2).toBeNull();
  });

  it('renders export button if export and LocalStorageAdapter are configured', () => {
    const annotation = {
      adapter: () => new LocalStorageAdapter(), exportLocalStorageAnnotations: true,
    };

    const initalState = { config: { annotation } };
    createWrapper({}, initalState);
    const button = screen.getByRole('button', { name: /Export local annotations for visible items/i });
    expect(button).toBeInTheDocument();
  });
});
