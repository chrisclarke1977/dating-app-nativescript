import { Observable } from '@nativescript/core';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

export class ProfileSetupViewModel extends Observable {
    private profileService = ProfileService.getInstance();
    private authService = AuthService.getInstance();
    
    private _photoURL: string = '';
    private _bio: string = '';
    private _interests: string[] = [];
    
    constructor() {
        super();
    }
    
    async completeSetup() {
        try {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
                await this.profileService.updateProfile(currentUser.id, {
                    photoURL: this._photoURL,
                    bio: this._bio,
                    interests: this._interests
                });
            }
        } catch (error) {
            throw error;
        }
    }
    
    async onChangePhoto() {
        try {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
                this._photoURL = await this.profileService.uploadProfileImage(currentUser.id);
                this.notifyPropertyChange('photoURL', this._photoURL);
            }
        } catch (error) {
            console.error('Photo upload error:', error);
        }
    }
    
    get photoURL(): string { return this._photoURL; }
    get bio(): string { return this._bio; }
    set bio(value: string) {
        if (this._bio !== value) {
            this._bio = value;
            this.notifyPropertyChange('bio', value);
        }
    }
    
    get interests(): string[] { return this._interests; }
    set interests(value: string[]) {
        if (this._interests !== value) {
            this._interests = value;
            this.notifyPropertyChange('interests', value);
        }
    }
}