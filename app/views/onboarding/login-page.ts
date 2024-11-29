import { EventData, Page, Frame } from '@nativescript/core';
import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new LoginViewModel();
}

export class LoginViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private authService = AuthService.getInstance();

    async onSignIn() {
        try {
            await this.authService.signIn(this._email, this._password);
            Frame.topmost().navigate({
                moduleName: 'views/matches/matches-page',
                clearHistory: true,
                animated: true
            });
        } catch (error) {
            console.error('Login error:', error);
            // Handle login error
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
}