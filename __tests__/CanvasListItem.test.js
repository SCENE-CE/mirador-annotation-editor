import React from 'react';

import CanvasListItem from '../src/CanvasListItem';
import AnnotationActionsContext from '../src/AnnotationActionsContext';
import { render, screen, fireEvent } from './test-utils';

const receiveAnnotation = jest.fn();
const storageAdapter = jest.fn(() => (
  {
    all: jest.fn().mockResolvedValue(
      {
        items: [
          { id: 'anno/2' },
        ],
      },
    ),
    annotationPageId: 'pageId/3',
    delete: jest.fn(async () => 'annoPageResultFromDelete'),
  }
));

/** */
function createWrapper(props, context = {}) {
  return render(
    <AnnotationActionsContext.Provider
      value={{
        canvases: [],
        receiveAnnotation,
        storageAdapter,
        switchToSingleCanvasView: () => undefined,
        ...context,
      }}
    >
      <CanvasListItem
        annotationid="anno/1"
        {...props}
      >
        <div>HelloWorld</div>
      </CanvasListItem>
    </AnnotationActionsContext.Provider>,
    {
      context,
    },
  );
}

describe('CanvasListItem', () => {
  it('wraps its children', () => {
    createWrapper();
    expect(screen.getByText('HelloWorld')).toBeInTheDocument();
  });

  it('shows an edit and delete button when it matches an editable annotationid and is hovering', () => {
    createWrapper({}, {
      annotationsOnCanvases: {
        'canv/1': {
          'annoPage/1': {
            json: {
              items: [
                {
                  id: 'anno/1',
                },
              ],
            },
          },
        },
      },
      canvases: [
        {
          id: 'canv/1',
        },
      ],
    });
    const annotationElement = screen.getAllByRole('listitem').find(
      (el) => el.getAttribute('annotationid') === 'anno/1',
    );
    fireEvent.mouseEnter(annotationElement);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('deletes from a storageAdapter when handling deletes', async () => {
    createWrapper({}, {
      annotationEditCompanionWindowIsOpened: true,
      annotationsOnCanvases: {
        'canv/1': {
          'annoPage/1': {
            json: {
              items: [
                {
                  id: 'anno/1',
                },
              ],
            },
          },
        },
      },
      canvases: [
        {
          id: 'canv/1',
        },
      ],
    });

    const annotationElement = screen.getAllByRole('listitem').find(
      (el) => el.getAttribute('annotationid') === 'anno/1',
    );
    fireEvent.mouseEnter(annotationElement);

    const deleteButton = screen.getByRole('button', { name: /delete/i });

    fireEvent.click(deleteButton);

    expect(storageAdapter).toHaveBeenCalledTimes(1);
    expect(storageAdapter).toHaveBeenCalledWith(
      'canv/1',
    );
  });
});
