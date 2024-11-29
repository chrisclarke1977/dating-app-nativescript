import { EventData, Page } from '@nativescript/core';
import { MatchesViewModel } from './matches-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new MatchesViewModel();
}