import { Observable } from '@nativescript/core';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

export class ProfileViewModel extends Observable {
  private profileService = ProfileService.getInstance();
  private authService = AuthService.getInstance();
  
  private _user: User;

  constructor() {
    super();
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this._user = await this.profileService.getProfile(currentUser.id);
      this.notifyPropertyChange('user', this._user);
    }
  }

  async onChangePhoto() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const photoURL = await this.profileService.uploadProfileImage(currentUser.id);
        this._user.photoURL = photoURL;
        await this.profileService.updateProfile(currentUser.id, { photoURL });
        this.notifyPropertyChange('user', this._user);
      }
    } catch (error) {
      console.error('Change photo error:', error);
    }
  }

  async onSaveProfile() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        await this.profileService.updateProfile(currentUser.id, this._user);
      }
    } catch (error) {
      console.error('Save profile error:', error);
    }
  }

  onAddInterest(args: any) {
    // Implementation for adding interests
    // You might want to show a dialog or navigate to another page
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    if (this._user !== value) {
      this._user = value;
      this.notifyPropertyChange('user', value);
    }
  }
}