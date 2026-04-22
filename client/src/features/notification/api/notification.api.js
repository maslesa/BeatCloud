import { api } from "../../../shared/api/axios";

export const getRecentNotifications = async () => {
    const res = await api.get('/notifications/recent');
    return res.data;
}

export const markNotificationAsRead = async (notificationId) => {
    const res = await api.patch(`/notifications/${notificationId}/read`);
    return res.data;
} 