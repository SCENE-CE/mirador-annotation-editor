import React, {useState} from 'react';
import {
    geomFromAnnoTarget,
    template, timeFromAnnoTarget,
} from './AnnotationFormUtils';
import TextCommentTemplate from "./annotationForm/TextCommentTemplate";
import ImageCommentTemplate from "./annotationForm/ImageCommentTemplate";
import NetworkCommentTemplate from "./annotationForm/NetworkCommentTemplate";
import DrawingTemplate from "./annotationForm/DrawingTemplate";
export default function AnnotationFormBody(
    {
    commentingType,
    windowId,
    overlay,
    annotation,
    mediaVideo,
    currentTime,
    setCurrentTime,
    setSeekTo,
    manifestType
    })
{

    // Initial state setup
    const [state, setState] = useState(() => {
        let tstart;
        let tend;
        const annoState = {};
        if (annotation) {
            // annotation body
            if (Array.isArray(annotation.body)) {
                annoState.tags = [];
                annotation.body.forEach((body) => {
                    if (body.purpose === 'tagging' && body.type === 'TextualBody') {
                        annoState.tags.push(body.value);
                    } else if (body.type === 'TextualBody') {
                        annoState.textBody = body.value;
                    } else if (body.type === 'Image') {
                        annoState.textBody = body.value; // why text body here ???
                        // annoState.image = body;
                    } else if (body.type === 'AnnotationTitle') {
                        annoState.title = body;
                    }
                });
            } else if (annotation.body.type === 'TextualBody') {
                annoState.textBody = annotation.body.value;
            } else if (annotation.body.type === 'Image') {
                annoState.textBody = annotation.body.value; // why text body here ???
                annoState.image = annotation.body;
            }
            // drawing position
            if (annotation.target.selector) {
                if (Array.isArray(annotation.target.selector)) {
                    annotation.target.selector.forEach((selector) => {
                        if (selector.type === 'SvgSelector') {
                            annoState.svg = selector.value;
                        } else if (selector.type === 'FragmentSelector') {
                            // TODO proper fragment selector extraction
                            annoState.xywh = geomFromAnnoTarget(selector.value);
                            [tstart, tend] = timeFromAnnoTarget(selector.value);
                        }
                    });
                } else {
                    annoState.svg = annotation.target.selector.value;
                    // TODO does this happen ? when ? where are fragments selectors ?
                }
            } else if (typeof annotation.target === 'string') {
                annoState.xywh = geomFromAnnoTarget(annotation.target);
                [tstart, tend] = timeFromAnnoTarget(annotation.target);
                annoState.tstart = tstart;
                annoState.tend = tend;
            }

            if (annotation.drawingState) {
                annoState.drawingState = JSON.parse(annotation.drawingState);
            }
            if (annotation.manifestNetwork) {
                annoState.manifestNetwork = annotation.manifestNetwork;
            }
        } else {
            if (mediaVideo) {
                // Time target
                annoState.tstart = currentTime ? Math.floor(currentTime) : 0;
                // eslint-disable-next-line no-underscore-dangle
                const annotJson = mediaVideo.props.canvas.__jsonld;
                annoState.tend = mediaVideo ? annotJson.duration : 0;

                // Geometry target
                const targetHeigth = mediaVideo ? annotJson.height : 1000;
                const targetWidth = mediaVideo ? annotJson.width : 500;
                annoState.xywh = `0,0,${targetWidth},${targetHeigth}`;
            } else {
                // TODO image and audio case
            }
            annoState.textBody = '';
            annoState.manifestNetwork = '';

        }

        return {
            mediaVideo,
            ...annoState,
            textEditorStateBustingKey: 0,
        };
    });
    const {
        manifestNetwork,
        textBody,
        tstart,
        tend,
        textEditorStateBustingKey,
        valueTime,
    } = state;

    //TODO: Mediaisvideo = ManifestType est n'est plus un booléen mais audio/video/image




    return(
        <div>
            {
                commentingType.id === template.TEXT_TYPE && (
                    <TextCommentTemplate
                        annoState={state}
                        setAnnoState={setState}
                        setCurrentTime={setCurrentTime}
                        setSeekTo={setSeekTo}
                        windowId={windowId}
                        commentingType={commentingType}
                        manifestType={manifestType}
                    />
                )
            }
            {
                commentingType.id === template.IMAGE_TYPE &&(
                <ImageCommentTemplate
                    annoState={state}
                    setAnnoState={setState}
                    setCurrentTime={setCurrentTime}
                    setSeekTo={setSeekTo}
                    windowId={windowId}
                    commentingType={commentingType}
                    manifestType={manifestType}
                />
              )
            }
            {
                commentingType.id === template.KONVA_TYPE &&(
                    <>
                        <DrawingTemplate
                        annoState={state}
                        setAnnoState={setState}
                        overlay={overlay}
                        setCurrentTime={setCurrentTime}
                        setSeekTo={setSeekTo}
                        windowId={windowId}
                        commentingType={commentingType}
                        manifestType={manifestType}
                        annotation={annotation}
                        />
                    </>
              )
            }
            {
                commentingType.id === template.MANIFEST_TYPE &&(
                        <NetworkCommentTemplate
                            annoState={state}
                            setAnnoState={setState}
                            setCurrentTime={setCurrentTime}
                            setSeekTo={setSeekTo}
                            windowId={windowId}
                            commentingType={commentingType}
                            manifestType={manifestType}
                        />
              )
            }
        </div>
    )
}