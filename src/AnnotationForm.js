import React, {useEffect} from 'react';
import CompanionWindow from "mirador/dist/es/src/containers/CompanionWindow";
export default  function AnnotationForm(
    {
        annotation,
        id,
        windowId,
    }
)
{

    useEffect(() => {
    console.log('annotation',annotation)
    console.log('WINowId',windowId)
    console.log('id',id)
    }, []);
return(
    <CompanionWindow
    title={annotation ? 'Edit annotation' : 'New annotation'}
    windowId={windowId}
    id={id}
        >
        <p>Hello World !</p>
    </CompanionWindow>
)
}

