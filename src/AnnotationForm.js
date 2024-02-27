import React, { useState } from 'react';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import PropTypes from 'prop-types';
import AnnotationFormTemplateSelector from './AnnotationFormTemplateSelector';
/**
 * Component for submitting a form to create or edit an annotation.
 * */
export default function AnnotationForm(
  {
    annotation,
    id,
    windowId,
  },
) {
  const [commentType, setCommentType] = useState('');

  return (
    <CompanionWindow
      title={annotation ? 'Edit annotation' : 'New annotation'}
      windowId={windowId}
      id={id}
    >
      <AnnotationFormTemplateSelector setCommentType={setCommentType} />
    </CompanionWindow>
  );
}

AnnotationForm.propTypes = {
  annotation: PropTypes.oneOfType([
    PropTypes.shape({
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
    }),
    PropTypes.string,
  ]),
  id: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,

};

AnnotationForm.defaultProps = {
  annotation: null,
};
