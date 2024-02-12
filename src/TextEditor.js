import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { styled } from '@mui/material/styles';

const StyledReactQuill = styled(ReactQuill)(({ theme }) => ({
  '.ql-editor': {
    minHeight: '150px',
  },
}));

/** Rich text editor for annotation body */
function TextEditor({ annoHtml, updateAnnotationBody }) {
  const [editorHtml, setEditorHtml] = useState(annoHtml);

  const handleChange = (html) => {
    setEditorHtml(html);
    if (updateAnnotationBody) {
      updateAnnotationBody(html);
    }
  };

  return (
    <div>
      <StyledReactQuill
        value={editorHtml}
        onChange={handleChange}
      />
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
