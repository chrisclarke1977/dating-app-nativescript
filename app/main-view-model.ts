import { Observable, Frame } from '@nativescript/core';

export class MainViewModel extends Observable {
    private _counter: number;
    private _message: string;

    constructor() {
        super();
        this._counter = 42;
        this.updateMessage();
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            this.notifyPropertyChange('message', value);
        }
    }

    navigateToMatches() {
        Frame.topmost().navigate({
            moduleName: "views/matches/matches-page",
            clearHistory: false,
            animated: true,
            transition: {
                name: "slide"
            }
        });
    }

    navigateToChat() {
        Frame.topmost().navigate({
            moduleName: "views/chat/chat-list-page",
            clearHistory: false,
            animated: true,
            transition: {
                name: "slide"
            }
        });
    }

    navigateToProfile() {
        Frame.topmost().navigate({
            moduleName: "views/profile/profile-page",
            clearHistory: false,
            animated: true,
            transition: {
                name: "slide"
            }
        });
    }

    navigateToSettings() {
        Frame.topmost().navigate({
            moduleName: "views/settings/settings-page",
            clearHistory: false,
            animated: true,
            transition: {
                name: "slide"
            }
        });
    }

    private updateMessage() {
        if (this._counter <= 0) {
            this.message = 'Start exploring matches!';
        } else {
            this.message = `Welcome to Dating App! Tap the icons below to navigate.`;
        }
    }
}