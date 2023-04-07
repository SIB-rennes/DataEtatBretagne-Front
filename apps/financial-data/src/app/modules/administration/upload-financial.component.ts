import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  AuditUpdateData,
  DataType,
} from '@models/audit/audit-update-data.models';
import { AuditHttpService } from '@services/audit.service';
import { FinancialDataHttpService } from '@services/financial-data-http.service';
import { AlertService } from 'apps/common-lib/src/public-api';
import { BehaviorSubject, Subscription, finalize } from 'rxjs';

@Component({
  selector: 'financial-upload-financial-component',
  templateUrl: './upload-financial.component.html',
  styleUrls: ['./upload-financial.component.scss'],
})
export class UploadFinancialComponent implements OnInit {
  public readonly requiredFileType: string = '.csv';

  uploadSub: Subscription | null = new Subscription();

  @ViewChild('fileUpload')
  fileUpload!: ElementRef<HTMLInputElement>;

  public file: File | null = null;
  public years;
  public dataSource: AuditUpdateData[] = [];

  /**
   * Indique si la recherche est en cours
   */
  public uploadInProgress = new BehaviorSubject(false);

  displayedColumns: string[] = ['username', 'filename', 'date'];

  public yearSelected = new Date().getFullYear();

  constructor(
    private service: FinancialDataHttpService,
    private auditService: AuditHttpService,
    private alertService: AlertService
  ) {
    const max_year = new Date().getFullYear();
    let arr = Array(8).fill(new Date().getFullYear());
    arr = arr.map((_val, index) => max_year - index);
    this.years = arr;
  }

  ngOnInit(): void {
    this._fetchAudit();
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  cancelUpload() {
    this.file = null;
  }

  uploadFinancialFile() {
    if (this.file !== null && this.yearSelected) {
      this.uploadInProgress.next(true);
      this.service
        .loadFileChorus(this.file, '' + this.yearSelected)
        .pipe(
          finalize(() => {
            this.cancelUpload();
            this.uploadInProgress.next(false);
          })
        )
        .subscribe({
          next: () => {
            this.alertService.openAlertSuccess(
              'Le fichier a bien été récupéré. Il sera traité dans les prochaines minutes.'
            );
            this._fetchAudit();
          },
          error: (err: HttpErrorResponse) => {
            if (err.error['message']) {
              this.alertService.openAlertError(err.error['message']);
            }
          },
        });
    }
  }

  private _fetchAudit() {
    this.auditService
      .getHistoryData(DataType.FINANCIAL_DATA)
      .subscribe((response: AuditUpdateData[]) => {
        this.dataSource = response;
      });
  }
}