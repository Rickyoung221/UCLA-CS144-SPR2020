import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  @Input("list")
  list: any[];

  @Output("refresh")
  refreshEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  clickRefresh() {
    this.refreshEmitter.emit();
  }
}
