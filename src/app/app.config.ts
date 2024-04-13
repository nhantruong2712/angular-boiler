import { APP_INITIALIZER, ApplicationConfig, Injector } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AppInitService } from './core/services/app-init.service';

function initializeApp(injector: Injector) {
    return () => {
        const appInitService = injector.get(AppInitService);
        return appInitService.initApp();
    };
}

const PROVIDERS = [
    {
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [Injector],
        multi: true
    },
]

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        ...PROVIDERS
    ]
};
