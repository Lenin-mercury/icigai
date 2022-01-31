import { apiUrl } from 'config';
import { fetchWrapper } from 'helpers';

export const domService = {
    getAll,
    getById,
    create   
};

const baseUrl = `${apiUrl}/users`;
// for  public dom where isprivate shoukd be false
function getAll() {
    return fetchWrapper.get(baseUrl);
}
// for private dom, wehere is private should be true for the respective user
function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    console.log(params,"----------------*********");
    return fetchWrapper.post(baseUrl, params);
}