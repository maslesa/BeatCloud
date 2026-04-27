import { api } from "../../../shared/api/axios";

export const toggleFollow = async (followingId) => {
    const res = await api.post(`/follow/toggle/${followingId}`);
    return res.data;
}