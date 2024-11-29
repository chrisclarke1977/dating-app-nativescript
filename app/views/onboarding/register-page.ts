import { EventData, Page } from '@nativescript/core';
import { RegisterViewModel } from './view-models/register-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new RegisterViewModel();
}