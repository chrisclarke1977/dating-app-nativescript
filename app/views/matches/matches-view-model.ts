import { Observable } from '@nativescript/core';
import { MatchingService } from '../../services/matching.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

export class MatchesViewModel extends Observable {
    private matchingService = MatchingService.getInstance();
    private authService = AuthService.getInstance();
    private _potentialMatches: User[] = [];
    private _currentIndex = 0;

    constructor() {
        super();
        this.loadPotentialMatches();
    }

    async loadPotentialMatches() {
        try {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
                this._potentialMatches = await this.matchingService.getPotentialMatches(currentUser.id);
                this.notifyPropertyChange('potentialMatches', this._potentialMatches);
            }
        } catch (error) {
            console.error('Load matches error:', error);
        }
    }

    async onLike() {
        try {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser && this._potentialMatches.length > this._currentIndex) {
                const matchedUser = this._potentialMatches[this._currentIndex];
                await this.matchingService.createMatch(currentUser.id, matchedUser.id);
                this._currentIndex++;
                this.notifyPropertyChange('potentialMatches', this._potentialMatches);
            }
        } catch (error) {
            console.error('Like error:', error);
        }
    }

    onPass() {
        if (this._potentialMatches.length > this._currentIndex) {
            this._currentIndex++;
            this.notifyPropertyChange('potentialMatches', this._potentialMatches);
        }
    }

    get potentialMatches(): User[] {
        return this._potentialMatches.slice(this._currentIndex);
    }
}