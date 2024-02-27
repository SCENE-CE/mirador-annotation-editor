import React, { useState } from 'react';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import PropTypes from 'prop-types';
import AnnotationFormTemplateSelector from './AnnotationFormTemplateSelector';
import { template } from './AnnotationFormUtils';
import AnnotationFormHeader from './AnnotationFormHeader';

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
  const [commentingType, setCommentingType] = useState(null);

  return (
    <CompanionWindow
      title={annotation ? 'Edit annotation' : 'New annotation'}
      windowId={windowId}
      id={id}
    >
      { commentingType === null
          && (
          <AnnotationFormTemplateSelector
            setCommentingType={setCommentingType}
          />
          )}
      {commentingType?.id === template.TEXT_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <p>TEXT TYPE</p>
          </div>
          )}
      {commentingType?.id === template.IMAGE_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <p>IMAGE TYPE</p>
          </div>
          )}
      {commentingType?.id === template.KONVA_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <p>KONVA TYPE</p>
          </div>
          )}
      {commentingType?.id === template.MANIFEST_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <p>MANIFEST TYPE</p>
          </div>
          )}
      {commentingType?.id === template.TAGGING_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <p>TAGGING TYPE</p>
          </div>
          )}
      {commentingType?.id === template.IIIF_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <p>IIIF TYPE</p>
          </div>
          )}
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
