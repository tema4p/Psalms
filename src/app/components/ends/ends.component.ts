import {Component, Input, SimpleChanges} from '@angular/core';
import endsRu from "../../data/ends-ru-json";
import endsCs from "../../data/ends-cs-json";
declare var _: any;

@Component({
  selector: 'ends',
  templateUrl: 'ends.component.html'
})

export class Ends {
  @Input()
  endId: string;
  @Input()
  settings: any;

  data: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
   let source: any;

   if (this.endId) {
      if (this.settings.textSource === 'ru') {
        source = (new endsRu()).data;
      } else if (this.settings.textSource === 'cs') {
        source = (new endsCs()).data;
      }
      this.data = source[this.endId].data;
    }
  }
}
