import React, {useEffect, useState} from 'react';
import CompanionWindow from "mirador/dist/es/src/containers/CompanionWindow";
import AnnotationFormTemplateSelector from "./AnnotationFormTemplateSelector";
export default  function AnnotationForm(
    {
        annotation,
        id,
        windowId,
    }
)
{
    const [commentType, setCommentType] = useState('');

return(
    <CompanionWindow
    title={annotation ? 'Edit annotation' : 'New annotation'}
    windowId={windowId}
    id={id}
        >
        <AnnotationFormTemplateSelector setCommentType={setCommentType}/>
    </CompanionWindow>
)
}

