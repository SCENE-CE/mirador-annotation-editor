import React, {useEffect} from 'react';
import {template} from "../AnnotationFormUtils";
import AnnotationFormTimeTarget from "./AnnotationFormTimeTarget";

export default function AnnotationFormTarget(
    {
        spatialTarget,
        commentingTypeId,
        mediaIsVideo,
        currentTime,
        setCurrentTime,
        setSeekTo,
        setState,
        tend,
        tstart,
        valueTime,
        videoDuration,
        windowId
    }
)
{

    return (
    <div>
        {
            spatialTarget &&(
                <>
                    <p>PLACE HOLDER SPATIAL TARGET</p>
                </>
            )
        }
        {
            commentingTypeId !== template.IIIF_TYPE && mediaIsVideo &&(
                <AnnotationFormTimeTarget
                    currentTime={currentTime}
                    mediaIsVideo={mediaIsVideo}
                    setCurrentTime={setCurrentTime}
                    setSeekTo={setSeekTo}
                    setState={setState}
                    tend={tend}
                    tstart={tstart}
                    value={valueTime}
                    videoDuration={videoDuration}
                    windowId={windowId}
                />
            )
        }
    </div>
    )
}

AnnotationFormTarget.PropType = {

}