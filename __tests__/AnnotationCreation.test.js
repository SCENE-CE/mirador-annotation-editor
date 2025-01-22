import React from 'react';

import {
  fireEvent, render, screen, waitFor,
} from './test-utils';
import TextCommentTemplate from '../src/annotationForm/TextCommentTemplate';

const container = document.createElement('div');
container.setAttribute('data-testid', 'drawContainer');

const playerReferences = {
  getContainer: jest.fn().mockReturnValue(container),
  getDisplayedMediaHeight: jest.fn().mockReturnValue(100),
  getDisplayedMediaWidth: jest.fn().mockReturnValue(200),
  getImagePosition: jest.fn().mockReturnValue({ x: 0, y: 10 }),
  getMediaTrueWidth: jest.fn().mockReturnValue(250),
  getMediaType: jest.fn(),
  getScale: jest.fn(),
  getZoom: jest.fn(),
};

/** */
function createWrapper(props) {
  const mockT = jest.fn().mockImplementation((key) => key);
  return render(
    <TextCommentTemplate
      annotation={{}}
      closeFormCompanionWindow={jest.fn()}
      playerReferences={playerReferences}
      saveAnnotation={jest.fn()}
      t={mockT}
      windowId="abc"
      {...props}
    />,
  );
}

describe('TextCreation', () => {
  it('renders a note', () => {
    createWrapper();
    expect(screen.getAllByText('note'));
  });
  it('has button tool selection', () => {
    createWrapper();
    expect(screen.getByLabelText('tool_selection'));
    const btns = screen.getAllByLabelText('select_cursor');
    expect(btns).toHaveLength(3);
  });
  it('adds the AnnotationDrawing component', () => {
    document.body.appendChild(container);
    expect(screen.getByTestId('drawContainer')).toBeInTheDocument();

    expect(container.querySelector('canvas')).not.toBeInTheDocument();
    createWrapper();
    expect(container.querySelector('canvas')).toBeInTheDocument();
    document.body.removeChild(container);
  });
  it('adds the TextEditor component', () => {
    createWrapper();
    const textEditor = screen.getByTestId('textEditor');
    expect(textEditor).toBeInTheDocument();
  });
  it('adds the annotation form footer', () => {
    createWrapper();
    expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument();
  });

  it('adds the ImageFormField component', async () => {
    createWrapper();
    const btns = screen.getAllByLabelText('select_cursor');
    fireEvent.click(btns[1]);

    await waitFor(() => screen.getAllByText(/shape/i));

    expect(screen.getByText('shape')).toBeInTheDocument();
    expect(screen.getByLabelText('add_a_rectangle'));
    expect(screen.getByLabelText('add_a_circle'));
  });
  it('can handle annotations without target selector', () => {
    const wrapper = createWrapper({
      annotation: {
        body: {
          purpose: 'commenting',
          value: 'Foo bar',
        },
        target: {},
      },
    });
    expect(wrapper).toBeDefined();
  });
});
