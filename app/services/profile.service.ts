import { DatabaseConnection } from '../database/db-config';
import { User } from '../models/user.model';
import * as imagepicker from '@nativescript/imagepicker';
import { File, knownFolders, path } from '@nativescript/core';

export class ProfileService {
    private static instance: ProfileService;

    private constructor() {}

    public static getInstance(): ProfileService {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance;
    }

    async uploadProfileImage(userId: string): Promise<string> {
        try {
            const context = imagepicker.create({ mode: "single" });
            const selection = await context.present();
            
            if (selection.length > 0) {
                const imageFile = selection[0];
                const fileName = `profile_${userId}_${Date.now()}.jpg`;
                const documentsPath = knownFolders.documents().path;
                const filePath = path.join(documentsPath, fileName);
                
                const file = File.fromPath(imageFile.path);
                await file.copy(filePath);

                const db = (await DatabaseConnection.getInstance()).getDatabase();
                await db.execSQL(
                    'UPDATE users SET photo_path = ? WHERE id = ?',
                    [filePath, userId]
                );

                return filePath;
            }
            throw new Error('No image selected');
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    async updateProfile(userId: string, profileData: Partial<User>): Promise<void> {
        const db = (await DatabaseConnection.getInstance()).getDatabase();
        
        await db.execSQL(`
            UPDATE users 
            SET display_name = ?, 
                bio = ?, 
                age = ?,
                latitude = ?,
                longitude = ?
            WHERE id = ?
        `, [
            profileData.displayName,
            profileData.bio,
            profileData.age,
            profileData.location?.latitude,
            profileData.location?.longitude,
            userId
        ]);

        if (profileData.interests) {
            await db.execSQL('DELETE FROM interests WHERE user_id = ?', [userId]);
            for (const interest of profileData.interests) {
                await db.execSQL(
                    'INSERT INTO interests (user_id, interest) VALUES (?, ?)',
                    [userId, interest]
                );
            }
        }
    }

    async getProfile(userId: string): Promise<User> {
        const db = (await DatabaseConnection.getInstance()).getDatabase();
        
        const userResult = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
        if (!userResult) {
            throw new Error('User not found');
        }

        const interests = await db.all(
            'SELECT interest FROM interests WHERE user_id = ?',
            [userId]
        );

        return {
            id: userResult.id.toString(),
            email: userResult.email,
            displayName: userResult.display_name || '',
            photoURL: userResult.photo_path || '',
            bio: userResult.bio || '',
            age: userResult.age || 0,
            interests: interests.map(i => i.interest),
            location: {
                latitude: userResult.latitude || 0,
                longitude: userResult.longitude || 0
            },
            matches: [],
            lastActive: new Date(userResult.last_active)
        };
    }
}