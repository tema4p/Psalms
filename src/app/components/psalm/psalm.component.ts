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
  psalm: any;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    let source;
    if (this.settings.textSource === 'ru') {
      source = (<any>window).psalmRuJson;
    } else if (this.settings.textSource === 'cs') {
      source = (<any>window).psalmCsJson;
    }

    this.psalm = source[this.psalmNumber];
    this.strings = this.psalm.strings;
  }
}
