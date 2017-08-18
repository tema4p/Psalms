import {Component, Input, SimpleChanges} from '@angular/core';

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
      this.kafisma = (<any>window).kafismaRuJson[this.kafismaNumber];
    }
    this.fetchKafismaEnd();

  }

  fetchKafismaEnd(): void {
    let source: any;
    if (this.settings.textSource === 'ru') {
      source = (<any>window).endsRu;
    } else if (this.settings.textSource === 'cs') {
      source = (<any>window).endsCs;
    }
    this.kafismaEnd = source[this.kafismaNumber];
  }

}
