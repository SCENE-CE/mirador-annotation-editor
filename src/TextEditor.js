import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {styled} from "@mui/material/styles";
import {Paper} from "@mui/material"; // include styles

const StyledReactQuill = styled(ReactQuill)(({ theme }) => ({
  ".ql-editor":{
  minHeight:'150px'
}
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
      <div>
        <StyledReactQuill
            value={editorHtml}
            onChange={handleChange}
            // You can also pass other props to customize the toolbar, etc.
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
