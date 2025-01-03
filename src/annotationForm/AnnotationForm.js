import React, { useEffect, useState } from 'react';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import PropTypes from 'prop-types';
import { Grid, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import { withTranslation } from 'react-i18next';
import i18n from 'i18next';
import AnnotationFormTemplateSelector from './AnnotationFormTemplateSelector';
import { getTemplateType, saveAnnotationInStorageAdapter, TEMPLATE } from './AnnotationFormUtils';
import AnnotationFormHeader from './AnnotationFormHeader';
import AnnotationFormBody from './AnnotationFormBody';
import { playerReferences } from '../playerReferences';
import { convertAnnotationStateToBeSaved } from '../IIIFUtils';
import '../118n';

// eslint-disable-next-line require-jsdoc
function AnnotationForm({
  annotation,
  canvases,
  closeCompanionWindow,
  currentTime,
  config,
  id,
  receiveAnnotation,
  windowId,
  t,
}) {
  const [templateType, setTemplateType] = useState(null);
  const [mediaType, setMediaType] = useState(playerReferences.getMediaType());

  const debugMode = config.debug === true;

  // Add translations from config to i18n
  useEffect(() => {
    if (i18n.isInitialized && config.translations) {
      Object.keys(config.translations).forEach((language) => {
        i18n.addResourceBundle(
          language,
          'translation',
          config.translations[language],
          true,
          true,
        );
      });

      if (config.language) {
        i18n.changeLanguage(config.language);
      }
    }
  }, [config.translations, config.language]);

  if (!templateType) {
    if (annotation.id) {
      if (annotation.maeData && annotation.maeData.templateType) {
        setTemplateType(getTemplateType(annotation.maeData.templateType));
      } else {
        setTemplateType(getTemplateType(TEMPLATE.IIIF_TYPE));
      }
    }
  }

  useEffect(() => {
    setTemplateType(null);
    setMediaType(playerReferences.getMediaType());
  }, [canvases[0].index]);

  const closeFormCompanionWindow = () => {
    closeCompanionWindow('annotationCreation', { id, position: 'right' });
  };

  const saveAnnotation = (annotationState) => {
    const promises = playerReferences.getCanvases().map(async (canvas) => {
      const annotationStateToBeSaved = await convertAnnotationStateToBeSaved(
        annotationState,
        canvas,
        windowId,
      );
      const storageAdapter = config.annotation.adapter(canvas.id);
      return saveAnnotationInStorageAdapter(
        canvas.id,
        storageAdapter,
        receiveAnnotation,
        annotationStateToBeSaved,
      );
    });

    Promise.all(promises).then(() => {
      closeFormCompanionWindow();
    });
  };
  if (!playerReferences.isInitialized()) {
    return (
      <CompanionWindow title={t('media_not_supported')} windowId={windowId} id={id}>
        <Grid container padding={1} spacing={1}>
          <Grid item>
            <Typography>{t('media_not_supported')}</Typography>
          </Grid>
          <Grid item>
            <Typography>
              {t('detected_media_type', { mediaType: playerReferences.getMediaType() })}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              {t('video_annotation_instruction')}
              {' '}
              <Link href="https://github.com/SCENE-CE/mirador-annotation-editor-video" target="_blank" rel="noopener noreferrer">
                {t('maev_github_link')}
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </CompanionWindow>
    );
  }

  return (
    <CompanionWindow
      title={annotation.id ? t('edit_annotation') : t('new_annotation')}
      windowId={windowId}
      id={id}
    >
      {templateType === null ? (
        <AnnotationFormTemplateSelector
          setCommentingType={setTemplateType}
          mediaType={mediaType}
          t={t}
        />
      ) : (
        <Grid container direction="column" spacing={1}>
          <Grid item container>
            <AnnotationFormHeader
              setCommentingType={setTemplateType}
              templateType={templateType}
              annotation={annotation}
            />
          </Grid>
          <Grid item>
            <AnnotationFormBody
              templateType={templateType}
              windowId={windowId}
              annotation={annotation}
              currentTime={currentTime}
              closeFormCompanionWindow={closeFormCompanionWindow}
              saveAnnotation={saveAnnotation}
              t={t}
              debugMode={debugMode}
              canvases={canvases}
            />
          </Grid>
        </Grid>
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
  canvases: PropTypes.object.isRequired,
  closeCompanionWindow: PropTypes.func,
  config: PropTypes.shape({
    annotation: PropTypes.shape({
      adapter: PropTypes.func,
      defaults: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.number, PropTypes.string]),
      ),
    }),
    debug: PropTypes.bool,
    translations: PropTypes.objectOf(PropTypes.object),
    language: PropTypes.string,
  }).isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]),
  id: PropTypes.string.isRequired,
  receiveAnnotation: PropTypes.func.isRequired,
  t: PropTypes.func,
  windowId: PropTypes.string.isRequired,
};

AnnotationForm.defaultProps = {
  annotation: null,
  closeCompanionWindow: () => {},
  currentTime: null,
};

export default withTranslation()(AnnotationForm);
