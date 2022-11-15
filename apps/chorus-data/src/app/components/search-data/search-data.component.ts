import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chorus-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('search');
  }
}
