import React, {useEffect} from 'react';
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

TargetFormSection.PropType = {

}