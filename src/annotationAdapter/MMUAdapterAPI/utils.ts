const storagePrefix = 'Mirador-multi-user-';
const storage = {

  getToken: () => JSON.parse(localStorage.getItem(`${storagePrefix}token`) as string),
};

export default storage;
