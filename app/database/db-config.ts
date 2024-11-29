import { Sqlite } from 'nativescript-sqlite';

export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private database: Sqlite;

    private constructor() {}

    public static async getInstance(): Promise<DatabaseConnection> {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
            await DatabaseConnection.instance.init();
        }
        return DatabaseConnection.instance;
    }

    private async init(): Promise<void> {
        this.database = await new Sqlite('dating_app.db');
        await this.createTables();
    }

    private async createTables(): Promise<void> {
        await this.database.execSQL(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                display_name TEXT,
                photo_path TEXT,
                bio TEXT,
                age INTEGER,
                latitude REAL,
                longitude REAL,
                last_active DATETIME
            )
        `);

        await this.database.execSQL(`
            CREATE TABLE IF NOT EXISTS interests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                interest TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        await this.database.execSQL(`
            CREATE TABLE IF NOT EXISTS matches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user1_id INTEGER,
                user2_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user1_id) REFERENCES users(id),
                FOREIGN KEY (user2_id) REFERENCES users(id)
            )
        `);

        await this.database.execSQL(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                match_id INTEGER,
                sender_id INTEGER,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                read BOOLEAN DEFAULT 0,
                FOREIGN KEY (match_id) REFERENCES matches(id),
                FOREIGN KEY (sender_id) REFERENCES users(id)
            )
        `);
    }

    public getDatabase(): Sqlite {
        return this.database;
    }
}