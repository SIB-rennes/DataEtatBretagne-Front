import { Component } from '@angular/core';

@Component({
  selector: 'lib-term-of-use',
  templateUrl: './term-of-use.component.html',
})
export class TermOfUseComponent {
  currentDomaine: string = window.location.hostname;
}
