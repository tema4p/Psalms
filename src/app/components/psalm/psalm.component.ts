import {Component, Input, SimpleChanges} from '@angular/core';
declare var _: any;

@Component({
  selector: 'psalm',
  templateUrl: 'psalm.component.html'
})

export class Psalm {
  @Input()
    psalmNumber: number;
  @Input()
    psalmPart: number;
  @Input()
    settings: any;

  strings: any[];
  strings2: any[];
  psalm: any;
  psalm2: any;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.settings) return;
    let source;
    if (this.settings.textSource === 'ru') {
      source = (<any>window).psalmRuJson;
    } else if (this.settings.textSource === 'cs') {
      source = (<any>window).psalmCsJson;
    }

    this.psalm = source[this.psalmNumber];
    this.strings = this.psalm.strings;

    this.psalm2 = (<any>window).psalmRuJson[this.psalmNumber];
    this.strings2 = this.psalm2.strings;

    _.each(this.strings, (item: any, index: number) => {
      item.v2 = this.strings2[index].v;
      item.n2 = this.strings2[index].n;
    });
    console.log('this.strings', this.strings);
  }
}
