import { EventEmitter } from "@angular/core";
import { RowData } from "./group-utils";

export interface OutputEvents {
    'click-on-row': EventEmitter<RowData>;
}