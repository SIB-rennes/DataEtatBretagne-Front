import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { dsConfiguration } from './configuration';
import { HttpClient } from '@angular/common/http';


@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class dsApiModule {
    public static forRoot(configurationFactory: () => dsConfiguration): ModuleWithProviders<dsApiModule> {
        return {
            ngModule: dsApiModule,
            providers: [ { provide: dsConfiguration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: dsApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('dsApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
