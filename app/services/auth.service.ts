import { DatabaseConnection } from '../database/db-config';
import { User } from '../models/user.model';
import * as bcrypt from 'bcryptjs';

export class AuthService {
    private static instance: AuthService;
    private currentUser: User | null = null;

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async signUp(email: string, password: string): Promise<User> {
        const db = (await DatabaseConnection.getInstance()).getDatabase();
        const passwordHash = await bcrypt.hash(password, 10);

        try {
            await db.execSQL(
                'INSERT INTO users (email, password_hash) VALUES (?, ?)',
                [email, passwordHash]
            );

            const result = await db.get('SELECT * FROM users WHERE email = ?', [email]);
            this.currentUser = this.mapDbUserToModel(result);
            return this.currentUser;
        } catch (error) {
            console.error('Sign up error:', error);
            throw new Error('Email already exists');
        }
    }

    async signIn(email: string, password: string): Promise<User> {
        const db = (await DatabaseConnection.getInstance()).getDatabase();
        const result = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!result) {
            throw new Error('User not found');
        }

        const isValid = await bcrypt.compare(password, result.password_hash);
        if (!isValid) {
            throw new Error('Invalid password');
        }

        this.currentUser = this.mapDbUserToModel(result);
        return this.currentUser;
    }

    async signOut(): Promise<void> {
        this.currentUser = null;
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    private mapDbUserToModel(dbUser: any): User {
        return {
            id: dbUser.id.toString(),
            email: dbUser.email,
            displayName: dbUser.display_name || '',
            photoURL: dbUser.photo_path || '',
            bio: dbUser.bio || '',
            age: dbUser.age || 0,
            interests: [],
            location: {
                latitude: dbUser.latitude || 0,
                longitude: dbUser.longitude || 0
            },
            matches: [],
            lastActive: new Date(dbUser.last_active)
        };
    }
}