import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input()
  contact: string | undefined;

  @Input()
  logo: string = 'DataEtat.svg';
}
