import {Component, Input, SimpleChanges} from '@angular/core';
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
   let source: string;

   if (this.endId) {
      if (this.settings.textSource === 'ru') {
        source = (<any>window).endsRu;
      } else if (this.settings.textSource === 'cs') {
        source = (<any>window).endsCs;
      }
      this.data = source[this.endId].data;
    }
  }
}
