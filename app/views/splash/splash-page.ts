import { EventData, Page, NavigationEntry } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    
    setTimeout(async () => {
        const authService = AuthService.getInstance();
        const currentUser = authService.getCurrentUser();
        
        const navigationEntry: NavigationEntry = {
            moduleName: currentUser ? 'views/matches/matches-page' : 'views/onboarding/welcome-page',
            clearHistory: true,
            animated: true,
            transition: {
                name: 'fade',
                duration: 300
            }
        };
        
        page.frame.navigate(navigationEntry);
    }, 2000); // Show splash for 2 seconds
}