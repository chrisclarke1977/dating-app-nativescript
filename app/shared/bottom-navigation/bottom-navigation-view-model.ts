import { Observable, Frame } from '@nativescript/core';

export class BottomNavigationViewModel extends Observable {
    private _currentPage: string;

    constructor(currentPage: string) {
        super();
        this._currentPage = currentPage;
    }

    get currentPage(): string {
        return this._currentPage;
    }

    navigateToMatches() {
        if (this._currentPage !== 'matches') {
            Frame.topmost().navigate({
                moduleName: "views/matches/matches-page",
                clearHistory: true
            });
        }
    }

    navigateToChat() {
        if (this._currentPage !== 'chat') {
            Frame.topmost().navigate({
                moduleName: "views/chat/chat-list-page",
                clearHistory: true
            });
        }
    }

    navigateToProfile() {
        if (this._currentPage !== 'profile') {
            Frame.topmost().navigate({
                moduleName: "views/profile/profile-page",
                clearHistory: true
            });
        }
    }

    navigateToSettings() {
        if (this._currentPage !== 'settings') {
            Frame.topmost().navigate({
                moduleName: "views/settings/settings-page",
                clearHistory: true
            });
        }
    }
}