import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

export class RegisterViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private _displayName: string = '';
    private _age: number = 18;
    
    constructor() {
        super();
    }
    
    async register() {
        try {
            const authService = AuthService.getInstance();
            await authService.signUp(this.email, this.password);
            // Additional profile setup will be handled in the next step
        } catch (error) {
            throw error;
        }
    }
    
    get email(): string { return this._email; }
    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }
    
    get password(): string { return this._password; }
    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }
    
    get displayName(): string { return this._displayName; }
    set displayName(value: string) {
        if (this._displayName !== value) {
            this._displayName = value;
            this.notifyPropertyChange('displayName', value);
        }
    }
    
    get age(): number { return this._age; }
    set age(value: number) {
        if (this._age !== value) {
            this._age = value;
            this.notifyPropertyChange('age', value);
        }
    }
}