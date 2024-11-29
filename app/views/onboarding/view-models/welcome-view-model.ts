import { Observable, Frame } from '@nativescript/core';

export class WelcomeViewModel extends Observable {
    constructor() {
        super();
    }

    onCreateAccount() {
        Frame.topmost().navigate({
            moduleName: 'views/onboarding/register-page',
            animated: true,
            transition: {
                name: 'slide',
                duration: 300
            }
        });
    }

    onSignIn() {
        Frame.topmost().navigate({
            moduleName: 'views/onboarding/login-page',
            animated: true,
            transition: {
                name: 'slide',
                duration: 300
            }
        });
    }
}