import { Request, Response } from "express";
import * as notificationService from "./notification.service";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const notifications = await notificationService.getNotifications(userId);
    res.status(200).json({
      message: "Notifications fetched successfully.",
      notifications,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.markAsRead(
      notificationId as string,
    );
    return res.status(200).json({
      message: "Notification updated successfully",
      notification,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};
