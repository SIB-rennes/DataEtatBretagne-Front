import { Component } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  standalone: true,
  templateUrl: './column-select.component.html',
  styleUrls: ['./column-select.component.scss'],
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ]
})
class ColumnSelectComponent {

}
