import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // include styles


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
        <ReactQuill
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
