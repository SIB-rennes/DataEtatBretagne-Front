import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FinancialDataHttpService } from '@services/financial-data-http.service';
import { AlertService } from 'apps/common-lib/src/public-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'financial-upload-financial-component',
  templateUrl: './upload-financial.component.html',
  styleUrls: ['./upload-financial.component.scss'],
})
export class UploadFinancialComponent {
  public readonly requiredFileType: string = '.csv';

  uploadSub: Subscription | null = new Subscription();

  @ViewChild('fileUpload')
  fileUpload!: ElementRef<HTMLInputElement>;

  public file: File | null = null;
  public years;
  // public yearDefault = new Date().getFullYear();
  public yearSelected = new Date().getFullYear();

  constructor(
    private service: FinancialDataHttpService,
    private alertService: AlertService
  ) {
    const max_year = new Date().getFullYear();
    let arr = Array(8).fill(new Date().getFullYear());
    arr = arr.map((_val, index) => max_year - index);
    this.years = arr;
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  cancelUpload() {
    this.file = null;
  }

  uploadFinancialFile() {
    if (this.file !== null && this.yearSelected) {
      this.service.loadFileChorus(this.file, '' + this.yearSelected).subscribe({
        next: () => {
          this.alertService.openAlertSuccess('Le fichier a bien été récupéré.');
        },
        error: (err: HttpErrorResponse) => {
          if (err.error['message']) {
            this.alertService.openAlertError(err.error['message']);
          }
        },
      });
    }
  }
}
