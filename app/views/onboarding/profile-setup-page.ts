import { EventData, Page } from '@nativescript/core';
import { ProfileSetupViewModel } from './profile-setup-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new ProfileSetupViewModel();
}

export function onComplete(args: EventData) {
    const page = <Page>args.object;
    const vm = page.bindingContext as ProfileSetupViewModel;
    vm.completeSetup().then(() => {
        page.frame.navigate({
            moduleName: 'views/matches/matches-page',
            clearHistory: true
        });
    }).catch(error => {
        console.error('Profile setup error:', error);
    });
}