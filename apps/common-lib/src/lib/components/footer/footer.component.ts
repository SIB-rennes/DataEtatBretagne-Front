import { Component, Inject, Input } from '@angular/core';
import { ISettingsService } from '../../environments/interface-settings.service';
import { SETTINGS } from '../../environments/settings.http.service';

@Component({
  selector: 'lib-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

  public contact?: string
  public url_github?: string

  constructor(@Inject(SETTINGS) public readonly settings: ISettingsService) {
    this.contact = settings.getSetting().contact
    this.url_github = settings.getSetting().url_github
  }

  @Input()
  logo: string = 'Infradonnee.svg';
}
