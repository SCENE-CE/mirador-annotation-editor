import React, {useEffect} from 'react';
import {manifestTypes, template} from "../AnnotationFormUtils";
import TargetTimeInput from "./TargetTimeInput";

export default function TargetFormSection(
    {
        spatialTarget,
        commentingTypeId,
        currentTime,
        setCurrentTime,
        setSeekTo,
        setAnnoState,
        windowId,
        manifestType,
        annoState
    }
)
{
    useEffect(() => {
        console.log('annoState',annoState)
    }, []);

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
            commentingTypeId !== template.IIIF_TYPE && manifestType === manifestTypes.VIDEO &&(
                <TargetTimeInput
                    windowId={windowId}
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                    setSeekTo={setSeekTo}
                    setAnnoState={setAnnoState}
                    annoState={annoState}
                />
            )
        }
    </div>
    )
}

TargetFormSection.PropType = {

}