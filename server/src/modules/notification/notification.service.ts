import { prisma } from "../../config/db";

export const getNotifications = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: { userID: userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      sender: {
        select: {
          username: true,
          profileImageURL: true,
        },
      },
      track: {
        select: {
          id: true,
          title: true,
          coverURL: true,
        },
      },
    },
  });

  return notifications;
};

export const markAsRead = async (notificationId: string) => {
  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
    },
  });

  return notification;
};
