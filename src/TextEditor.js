import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // include styles
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
  const [editorHtml, setEditorHtml] = useState(annoHtml);

  const handleChange = (html) => {
    setEditorHtml(html);
    if (updateAnnotationBody) {
      updateAnnotationBody(html);
    }
  };

  return (
      <EditorRoot>
        <ReactQuill
            value={editorHtml}
            onChange={handleChange}
            // You can also pass other props to customize the toolbar, etc.
        />
      </EditorRoot>
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
