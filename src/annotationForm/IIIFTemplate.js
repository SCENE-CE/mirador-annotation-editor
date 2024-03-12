import React, { useState } from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import PropTypes from 'prop-types';
import 'jsoneditor-react/es/editor.min.css';
import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import { styled } from '@mui/system';
import { Paper } from '@mui/material';
import AnnotationFormFooter from './AnnotationFormFooter';
import { template } from '../AnnotationFormUtils';

/**
 * IIIFTemplate component
 * @param annotation
 * @returns {JSX.Element}
 */
export default function IIIFTemplate({
  annotation,
  saveAnnotation,
  closeFormCompanionWindow,
  canvases,

}) {
  let maeAnnotation = annotation;
  if (!annotation.id) {
    // If the annotation does not have maeData, the annotation was not created with mae
    maeAnnotation = {
      id: null,
      motivation: '',
      target: '',
      body: {
        id: '',
        type: '',
        value: '',
      },
      maeData: {
        templateType: template.IIIF_TYPE,
      },
    };
  }

  const [annotationState, setAnnotationState] = useState(maeAnnotation);

  /**
   * Save function for the annotation
   * @returns {Object}
   */
  const saveFunction = () => {
    // We return annotation to save it
    canvases.forEach(async (canvas) => {
      // Adapt target to the canvas
      // eslint-disable-next-line no-param-reassign
      // annotation.target = `${canvas.id}#xywh=${target.xywh}&t=${target.t}`;
      saveAnnotation(annotationState, canvas.id);
    });
    closeFormCompanionWindow();
  };

  return (
    <>
      <Paper
        elevation={0}
        style={{ minHeight: '300px' }}
      >
        <Editor
          value={annotationState}
          ace={ace}
          theme="ace/theme/github"
          onChange={setAnnotationState}
        />
      </Paper>
      <AnnotationFormFooter
        closeFormCompanionWindow={closeFormCompanionWindow}
        saveAnnotation={saveFunction}
      />
    </>
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
    maeData: PropTypes.object,
    manifestNetwork: PropTypes.string,
    motivation: PropTypes.string,
    target: PropTypes.string,
  }).isRequired,
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
};
