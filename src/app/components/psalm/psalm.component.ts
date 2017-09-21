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
    let source, source2;
    if (this.settings.textSource === 'ru') {
      source = (<any>window).psalmRuJson;
    } else if (this.settings.textSource === 'cs') {
      source = (<any>window).psalmCsJson;
    }

    if (this.settings.textSource2 === 'ru') {
      source2 = (<any>window).psalmRuJson;
    } else if (this.settings.textSource2 === 'sn') {
      source2 = (<any>window).psalmSnJson;
    }

    this.psalm = source[this.psalmNumber];
    this.strings = this.psalm.strings;

    if (this.psalmNumber === 118) {
      this.strings = _.filter(this.psalm.strings, {p: this.psalmPart});
    }

    if (source2) {
      this.psalm2 = source2[this.psalmNumber];
      this.strings2 = this.psalm2.strings;

      if (this.psalmNumber === 118) {
        this.strings2 = _.filter(this.psalm2.strings, {p: this.psalmPart});
      }

      _.each(this.strings, (item: any, index: number) => {
        if (!this.strings2[index]) return;
        item.v2 = this.strings2[index].v;
        item.n2 = this.strings2[index].n;
      });
    }
  }
}
