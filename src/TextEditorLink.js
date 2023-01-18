// Add Link Component
import React from 'react';
import { CompositeDecorator, EditorState, Modifier } from 'draft-js';

/** */
function Link({ entityKey, contentState, children }) {
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a
      style={{ color: 'blue', fontStyle: 'italic' }}
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

/** */
const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null
            && contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
};

/** */
export const createLinkDecorator = () => new
CompositeDecorator([
  {
    component: Link,
    strategy: findLinkEntities,
  },
]);

// call all together
/** */
export const onAddLink = (editorState, setEditorState) => {
  const linkUrl = window.prompt('Add link http:// ');
  const decorator = createLinkDecorator();
  if (linkUrl) {
    const displayLink = window.prompt('Display Text');
    if (displayLink) {
      const currentContent = editorState.getCurrentContent();
      const createEntity = currentContent.createEntity('LINK', 'MUTABLE', {
        url: linkUrl,
      });
      const entityKey = currentContent.getLastCreatedEntityKey();
      const selection = editorState.getSelection();
      const textWithEntity = Modifier.insertText(
        currentContent,
        selection,
        displayLink,
        null,
        entityKey,
      );
      const newState = EditorState.createWithContent(textWithEntity, decorator);
      setEditorState(newState);
    }
  }
};
