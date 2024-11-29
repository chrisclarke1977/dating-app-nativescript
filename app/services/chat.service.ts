import { DatabaseConnection } from '../database/db-config';
import { Observable } from '@nativescript/core';

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    read: boolean;
}

export class ChatService {
    private static instance: ChatService;

    private constructor() {}

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    async sendMessage(matchId: string, message: Omit<Message, 'id'>): Promise<void> {
        try {
            const db = (await DatabaseConnection.getInstance()).getDatabase();
            await db.execSQL(`
                INSERT INTO messages (match_id, sender_id, content, read)
                VALUES (?, ?, ?, ?)
            `, [matchId, message.senderId, message.content, false]);
        } catch (error) {
            console.error('Send message error:', error);
            throw error;
        }
    }

    getMessages(matchId: string): Observable<Message[]> {
        return new Observable(subscriber => {
            const fetchMessages = async () => {
                try {
                    const db = (await DatabaseConnection.getInstance()).getDatabase();
                    const messages = await db.all(`
                        SELECT * FROM messages
                        WHERE match_id = ?
                        ORDER BY timestamp DESC
                        LIMIT 50
                    `, [matchId]);

                    subscriber.next(messages.map(msg => ({
                        id: msg.id.toString(),
                        senderId: msg.sender_id.toString(),
                        content: msg.content,
                        timestamp: new Date(msg.timestamp),
                        read: Boolean(msg.read)
                    })));
                } catch (error) {
                    subscriber.error(error);
                }
            };

            // Initial fetch
            fetchMessages();

            // Poll for new messages every 3 seconds
            const intervalId = setInterval(fetchMessages, 3000);

            // Cleanup
            return () => clearInterval(intervalId);
        });
    }

    async markMessagesAsRead(matchId: string, userId: string): Promise<void> {
        try {
            const db = (await DatabaseConnection.getInstance()).getDatabase();
            await db.execSQL(`
                UPDATE messages
                SET read = 1
                WHERE match_id = ?
                AND sender_id != ?
                AND read = 0
            `, [matchId, userId]);
        } catch (error) {
            console.error('Mark messages as read error:', error);
            throw error;
        }
    }
}