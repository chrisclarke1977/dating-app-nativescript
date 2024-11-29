import { DatabaseConnection } from '../database/db-config';
import { User } from '../models/user.model';
import { Observable } from '@nativescript/core';

export class MatchingService {
    private static instance: MatchingService;

    private constructor() {}

    public static getInstance(): MatchingService {
        if (!MatchingService.instance) {
            MatchingService.instance = new MatchingService();
        }
        return MatchingService.instance;
    }

    async getPotentialMatches(userId: string, radius: number = 50): Promise<User[]> {
        try {
            const db = (await DatabaseConnection.getInstance()).getDatabase();
            
            // Get current user's location
            const currentUser = await db.get(
                'SELECT latitude, longitude FROM users WHERE id = ?',
                [userId]
            );

            // Get all users except current user
            const potentialMatches = await db.all(`
                SELECT u.*, GROUP_CONCAT(i.interest) as interests
                FROM users u
                LEFT JOIN interests i ON u.id = i.user_id
                WHERE u.id != ?
                GROUP BY u.id
            `, [userId]);

            return potentialMatches
                .map(user => ({
                    id: user.id.toString(),
                    email: user.email,
                    displayName: user.display_name || '',
                    photoURL: user.photo_path || '',
                    bio: user.bio || '',
                    age: user.age || 0,
                    interests: user.interests ? user.interests.split(',') : [],
                    location: {
                        latitude: user.latitude || 0,
                        longitude: user.longitude || 0
                    },
                    matches: [],
                    lastActive: new Date(user.last_active)
                }))
                .filter(user => this.calculateDistance(
                    { latitude: currentUser.latitude, longitude: currentUser.longitude },
                    user.location
                ) <= radius);
        } catch (error) {
            console.error('Get matches error:', error);
            throw error;
        }
    }

    async createMatch(userId1: string, userId2: string): Promise<void> {
        try {
            const db = (await DatabaseConnection.getInstance()).getDatabase();
            await db.execSQL(`
                INSERT INTO matches (user1_id, user2_id)
                VALUES (?, ?)
            `, [userId1, userId2]);
        } catch (error) {
            console.error('Create match error:', error);
            throw error;
        }
    }

    private calculateDistance(loc1: {latitude: number, longitude: number}, 
                            loc2: {latitude: number, longitude: number}): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(loc2.latitude - loc1.latitude);
        const dLon = this.toRad(loc2.longitude - loc1.longitude);
        const lat1 = this.toRad(loc1.latitude);
        const lat2 = this.toRad(loc2.latitude);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    private toRad(value: number): number {
        return value * Math.PI / 180;
    }
}