import React from 'react';
import {template} from "../AnnotationFormUtils";
import TargetTimeInput from "./TargetTimeInput";

export default function TargetFormSection(
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
                <TargetTimeInput
                    mediaIsVideo={mediaIsVideo}
                    windowId={windowId}
                />
            )
        }
    </div>
    )
}

TargetFormSection.PropType = {

}