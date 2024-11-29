import { EventData, Page } from '@nativescript/core';
import { BottomNavigationViewModel } from './bottom-navigation-view-model';

export function onLoaded(args: EventData) {
    const page = <Page>args.object;
    const currentPage = page.bindingContext?.currentPage || 'matches';
    page.bindingContext = new BottomNavigationViewModel(currentPage);
}