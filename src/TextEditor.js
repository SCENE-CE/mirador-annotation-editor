import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, RichUtils } from 'draft-js';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import BoldIcon from '@mui/icons-material/FormatBold';
import ItalicIcon from '@mui/icons-material/FormatItalic';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { styled } from '@mui/system';

const EditorRoot = styled('div')(({ theme }) => ({
  borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'solid',
  borderWidth: 1,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
}));

function TextEditor({ annoHtml, updateAnnotationBody }) {
  const [editorState, setEditorState] = useState(EditorState.createWithContent(stateFromHTML(annoHtml)));
  const editorRef = useRef(null);

  useEffect(() => {
    // Any effect that might be needed on component mount/update
  }, [/* dependencies */]);

  const handleFocus = () => {
    editorRef.current?.focus();
  };

  const handleFormating = (e, newFormat) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, newFormat));
  };

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onChange = (state) => {
    setEditorState(state);
    if (updateAnnotationBody) {
      const options = {
        inlineStyles: {
          BOLD: { element: 'b' },
          ITALIC: { element: 'i' },
        },
      };
      updateAnnotationBody(stateToHTML(state.getCurrentContent(), options).toString());
    }
  };

  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div>
      <EditorRoot onClick={handleFocus}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          ref={editorRef}
        />
      </EditorRoot>
      <ToggleButtonGroup size="small" value={currentStyle.toArray()}>
        <ToggleButton onClick={handleFormating} value="BOLD">
          <BoldIcon />
        </ToggleButton>
        <ToggleButton onClick={handleFormating} value="ITALIC">
          <ItalicIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

TextEditor.propTypes = {
  annoHtml: PropTypes.string,
  updateAnnotationBody: PropTypes.func,
};

TextEditor.defaultProps = {
  annoHtml: '',
  updateAnnotationBody: () => {},
};

export default TextEditor;
