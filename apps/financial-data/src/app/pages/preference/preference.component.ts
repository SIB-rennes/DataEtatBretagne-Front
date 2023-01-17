import { Component } from '@angular/core';

@Component({
  selector: 'financial-preference',
  templateUrl: './preference.component.html',
})
export class PreferenceComponent {
  public mappingFilter = { year: 'Année', bops: 'Programmes' };
}
