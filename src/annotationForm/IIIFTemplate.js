import React from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import PropTypes from 'prop-types';
import 'jsoneditor-react/es/editor.min.css';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

/**
 * IIIFTemplate component
 * @param annotation
 * @returns {JSX.Element}
 */
export default function IIIFTemplate({ annotation, setSaveFunction }) {

  /**
   * Save function for the annotation
   * @returns {Object}
   */
  const saveFunction = () => {
    // We return annotation to save it
    console.log('Save function in IIIF');
    return annotation;
  }

  setSaveFunction(saveFunction);

  return (
    <Editor
      value={annotation}
      ace={ace}
      theme="ace/theme/github"
      onChange={() => {
      }}
    />
  );
}
IIIFTemplate.propTypes = {
  annotation: PropTypes.shape({
    body: PropTypes.shape({
      format: PropTypes.string,
      id: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string,
    }),
    drawingState: PropTypes.string,
    id: PropTypes.string,
    manifestNetwork: PropTypes.string,
    motivation: PropTypes.string,
    target: PropTypes.string,
  }).isRequired,
  setSaveFunction: PropTypes.func.isRequired,
};
