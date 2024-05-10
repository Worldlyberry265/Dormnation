import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { enviroment } from './enviroments/enviroments';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NHaF1cWmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjW31WcXFQT2BeUkN1Vg==');

if (enviroment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));