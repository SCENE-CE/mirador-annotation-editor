import storage from './utils';

export const upsertAnnotationPage = async (annotationPageDto) => {
  try {
    const token = storage.getToken();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/annotation-page`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(annotationPageDto),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
