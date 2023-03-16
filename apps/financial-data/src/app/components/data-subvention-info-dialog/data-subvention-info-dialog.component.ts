import { Component, inject, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataSubventionInfoDialogData } from './data-subvention-info-dialog-data';
import { RepresentantLegal, Subvention } from 'apps/clients/ds-client';
import { DataSubventionObjectifsDialogComponent } from '../data-subvention-objectifs-dialog/data-subvention-objectifs-dialog.component';
import { DataSubventionInfoDialogService } from './data-subvention-info-dialog.service';
import { AlertService } from 'apps/common-lib/src/public-api';

const InformationsSubventionPropPP: { [index: string]: string } = {
  'ej': 'Numéro EJ',
  'service_instructeur': 'Service Instructeur',
  'sous_dispositif': 'Sous Dispositif',
  'montant_demande': 'Montant demandé',
  'montant_accorde': 'Montant accordé',
  'plus': "Plus d'informations",
} as const;

const InformationPresidentPP: { [index: string]: string } = {
  'telephone': 'Téléphone',
  'email': 'Email',
  'prenom': 'Prénom',
  'civilite': 'Civilité',
  'nom': 'Nom',
  'role': "Rôle",
} as const;

@Component({
  selector: 'financial-data-subvention-info-dialog',
  templateUrl: './data-subvention-info-dialog.component.html',
  providers: [
    DataSubventionInfoDialogService
  ]
})
export class DataSubventionInfoDialogComponent {

  private dialog = inject(MatDialog);
  private service = inject(DataSubventionInfoDialogService);
  private alertService = inject(AlertService);

  isLoading = true;
  isError = false;

  public president: RepresentantLegal | null = null;
  public president_props: string[] = [];
  public subvention: Subvention | null = null;
  public subvention_props: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DataSubventionInfoDialogData) {
    let siret = data.row['code_siret'];
    let ej = data.row['NEj'];

    this.isError = false
    this.isLoading = true;

    this.service.load_informations(siret, ej).subscribe(data => {
      this.subvention = data.subvention;
      this.subvention_props = this._subventionDisplayedColumns();

      this.president = data.president;
      this.president_props = this._presidentDisplayedColumns();

      this.isLoading = false;
      this.isError = false;
    }, err => {
      this.alertService.openAlertError(`Une erreur est survenue lors de notre communication avec data subventions.`)
      this.isLoading = false;
      this.isError = true;
    })
  }

  public get_president_prop(key: string) {
    let president = this.president as any;
    return president[key];
  }

  public get_subvention_prop(key: string) {
    let subvention = this.subvention as any;
    return subvention[key];
  }

  _presidentDisplayedColumns() {
    let props = []
    for( let prop in this.president) {
      props.push(prop)
    }
    return props;
  }

  _subventionDisplayedColumns() {

    let excl = ['actions_proposees'];

    if (this.subvention == null)
      return []

    let props = []
    for (let prop in this.subvention) {
      if (excl.includes(prop)) {
        continue
      }
      props.push(prop)
    }
    return props;
  }

  pretty(prop: string) {
    return InformationsSubventionPropPP[prop] || InformationPresidentPP[prop] || prop;
  }

  public get actions_proposees() {
    return this.subvention?.actions_proposees;
  }

  public get hasPlusDinfo() {

    if (!this.subvention?.actions_proposees)
      return false;
    
    return this.subvention?.actions_proposees?.length > 0
  }
  onPlusDinfoClic() {
    this.dialog.open(DataSubventionObjectifsDialogComponent, {
      width: '100%',
      data: {
        'actions_proposees': this.subvention?.actions_proposees
      }
    });
  }
}
