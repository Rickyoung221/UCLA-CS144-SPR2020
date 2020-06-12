import { OnInit, Component } from '@angular/core';
import { FetchService } from './fetch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'final-angular';
  list = [];

  constructor(
    private fetch: FetchService,
  ) {

  }

  ngOnInit() {
    this.fetch.get("http://oak.cs.ucla.edu/classes/cs144/examples/exam/angular/load/").then((list: string[]) => {
      this.list = list;
    });
  }

  refresh() {
    this.fetch.get("http://oak.cs.ucla.edu/classes/cs144/examples/exam/angular/refresh/").then((list: string[]) => {
      this.list = list;
    });
  }
}
