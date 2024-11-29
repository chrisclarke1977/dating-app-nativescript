import { EventData, Page } from '@nativescript/core';
import { WelcomeViewModel } from './view-models/welcome-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new WelcomeViewModel();
}