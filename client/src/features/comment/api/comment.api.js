import { api } from "../../../shared/api/axios";

export const getComments = async (trackID) => {
    const res = await api.get(`/comment/get/${trackID}`);
    return res.data;
}

export const postComment = async (trackID, content) => {
    const res = await api.post(`/comment/${trackID}`, { content });
    return res.data;
}