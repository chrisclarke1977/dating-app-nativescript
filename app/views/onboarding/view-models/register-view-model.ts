import { Observable, Frame } from '@nativescript/core';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';

export class RegisterViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private _displayName: string = '';
    private _age: number = 18;
    private _emailError: string = '';
    private _passwordError: string = '';
    private _displayNameError: string = '';
    private _ageError: string = '';
    private _generalError: string = '';
    private _isLoading: boolean = false;
    private authService = AuthService.getInstance();
    private profileService = ProfileService.getInstance();
    
    constructor() {
        super();
    }
    
    async onContinue() {
        try {
            this.clearErrors();
            
            if (!this.validateForm()) {
                return;
            }

            this._isLoading = true;
            this.notifyPropertyChange('isLoading', true);

            // Register the user
            const user = await this.authService.signUp(this._email, this._password);

            // Update initial profile information
            await this.profileService.updateProfile(user.id, {
                displayName: this._displayName,
                age: this._age,
                bio: '',
                interests: [],
                location: {
                    latitude: 0,
                    longitude: 0
                }
            });

            // Navigate directly to matches page
            Frame.topmost().navigate({
                moduleName: 'views/matches/matches-page',
                clearHistory: true,
                animated: true,
                transition: {
                    name: 'slide',
                    duration: 300
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            
            // Handle specific error cases
            if (error instanceof Error) {
                if (error.message.includes('Email already exists')) {
                    this._emailError = 'This email is already registered. Please use a different email or sign in.';
                    this.notifyPropertyChange('emailError', this._emailError);
                } else if (error.message.includes('network')) {
                    this._generalError = 'Network error. Please check your internet connection and try again.';
                    this.notifyPropertyChange('generalError', this._generalError);
                } else if (error.message.includes('database')) {
                    this._generalError = 'Unable to create account at this time. Please try again later.';
                    this.notifyPropertyChange('generalError', this._generalError);
                } else if (error.message.includes('invalid')) {
                    this._emailError = 'Please enter a valid email address.';
                    this.notifyPropertyChange('emailError', this._emailError);
                } else {
                    this._generalError = 'An unexpected error occurred. Please try again later.';
                    this.notifyPropertyChange('generalError', this._generalError);
                }
            } else {
                this._generalError = 'Unable to create your account. Please try again.';
                this.notifyPropertyChange('generalError', this._generalError);
            }
        } finally {
            this._isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    private validateForm(): boolean {
        let isValid = true;

        // Email validation
        if (!this._email) {
            this._emailError = 'Email is required';
            isValid = false;
        } else if (!this._email.includes('@') || !this._email.includes('.')) {
            this._emailError = 'Please enter a valid email address';
            isValid = false;
        }
        this.notifyPropertyChange('emailError', this._emailError);

        // Password validation
        if (!this._password) {
            this._passwordError = 'Password is required';
            isValid = false;
        } else if (this._password.length < 6) {
            this._passwordError = 'Password must be at least 6 characters';
            isValid = false;
        } else if (!/[A-Z]/.test(this._password)) {
            this._passwordError = 'Password must contain at least one uppercase letter';
            isValid = false;
        } else if (!/[0-9]/.test(this._password)) {
            this._passwordError = 'Password must contain at least one number';
            isValid = false;
        }
        this.notifyPropertyChange('passwordError', this._passwordError);

        // Display name validation
        if (!this._displayName) {
            this._displayNameError = 'Display name is required';
            isValid = false;
        } else if (this._displayName.length < 2) {
            this._displayNameError = 'Display name must be at least 2 characters';
            isValid = false;
        }
        this.notifyPropertyChange('displayNameError', this._displayNameError);

        // Age validation
        if (!this._age) {
            this._ageError = 'Age is required';
            isValid = false;
        } else if (this._age < 18) {
            this._ageError = 'You must be at least 18 years old';
            isValid = false;
        } else if (this._age > 120) {
            this._ageError = 'Please enter a valid age';
            isValid = false;
        }
        this.notifyPropertyChange('ageError', this._ageError);

        return isValid;
    }

    private clearErrors() {
        this._emailError = '';
        this._passwordError = '';
        this._displayNameError = '';
        this._ageError = '';
        this._generalError = '';
        
        this.notifyPropertyChange('emailError', '');
        this.notifyPropertyChange('passwordError', '');
        this.notifyPropertyChange('displayNameError', '');
        this.notifyPropertyChange('ageError', '');
        this.notifyPropertyChange('generalError', '');
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

    get emailError(): string { return this._emailError; }
    get passwordError(): string { return this._passwordError; }
    get displayNameError(): string { return this._displayNameError; }
    get ageError(): string { return this._ageError; }
    get generalError(): string { return this._generalError; }
    get isLoading(): boolean { return this._isLoading; }
}