import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelError } from 'apps/clients/apis-externes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'financial-informations-supplementaires-chargement-ou-erreur',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './chargement-ou-erreur.component.html',
  styleUrls: ['../commun-informations-supplementaires.scss', './chargement-ou-erreur.component.scss']
})
export class ChargementOuErreurComponent {
  @Input() erreur: ModelError | null = null

  @Input() nom_service_distant: string = 'Inconnu';
}
