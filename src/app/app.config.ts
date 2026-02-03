import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { route } from './app.route';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../core/interceptor/auth.interceptor';
import { response_formatInterceptor } from '../core/interceptor/resp_error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      route,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      }),
      withViewTransitions(),
    ),
    provideAnimations(),
    provideHttpClient(withInterceptors([response_formatInterceptor, authInterceptor])),
  ],
};
