export interface notificationType {
    content: string;
    user: string;
    createdAt: Date;
    updatedAt: Date;
    isRead: boolean;
    title: string;
    type: string;
    id: string;
    _id: string;
}

export interface notificationResponseType {
    message: string,
    data: notificationType[]
}