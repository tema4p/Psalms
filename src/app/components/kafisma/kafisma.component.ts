import {Component, Input, SimpleChanges} from '@angular/core';
import kafismaRuJson from "../../data/kafisma-ru-json";
import endsRu from "../../data/ends-ru-json";
import endsCs from "../../data/ends-cs-json";
declare var _: any;

@Component({
  selector: 'kafisma',
  templateUrl: 'kafisma.component.html'
})

export class Kafisma {
  @Input()
  kafismaNumber: number;
  @Input()
  settings: any;

  strings: any[];
  kafisma: any;
  kafismaEnd: any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.kafismaNumber) {
      this.kafisma = (new kafismaRuJson()).data[this.kafismaNumber];
    }
    this.fetchKafismaEnd();

  }

  fetchKafismaEnd(): void {
    let source: any;
    if (this.settings.textSource === 'ru') {
      source = (new endsRu()).data;
    } else if (this.settings.textSource === 'cs') {
      source = (new endsCs()).data;
    }
    this.kafismaEnd = source[this.kafismaNumber];
  }

}
