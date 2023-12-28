import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
// import { initDevTools, runUniStateLogger } from '@unistate/dev-tools';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if (isDevMode()) {
      // initDevTools();
      // runUniStateLogger();
    }
  })
  .catch(err => console.error(err));
