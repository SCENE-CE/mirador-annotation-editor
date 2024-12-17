import storage from "./utils";

export const gettingAnnotationPage = async (annotationPageId:string, projectId:number)=>{
    try{
        const token = storage.getToken();
        const encodedURI = encodeURIComponent(annotationPageId)
        console.log('encodedURI',encodedURI);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/annotation-page/${encodedURI}/${projectId}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        const responseGetAll= await response.json();
        console.log('responseGetAll',responseGetAll);
        return responseGetAll;
    }catch(error){
        console.error(error);
    }
}
