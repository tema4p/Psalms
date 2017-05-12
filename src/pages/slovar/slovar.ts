import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
declare var _:any;

@Component({
  selector: 'slovar',
  templateUrl: 'slovar.html'
})
export class SlovarPage {
  words: Array<{word: string, desc: string, wordLower: string}> = [];
  public query: string = '';
  public limit: number = 40;
  public start: number = 0;

  private source: any[] = (<any> window).slovar.words;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    _.each(this.source, (item) => {
      item.wordLower = item.word.toLowerCase()
    });
    this.words = this.filter('');
  }

  getItems(ev: any): any[] {
    this.query = ev.target.value;
    this.start = 0;
    this.words = this.filter(ev.target.value);
    return
  }

  filter(query: string): any[] {
    console.log('filter', query);
    if (query && query.trim() != '') {
      return  this.source.filter((item) => {
        return (item.wordLower.indexOf(query.toLowerCase()) > -1);
      }).slice(this.start, this.start + this.limit);
    } else {
      return this.source.slice(this.start, this.start + this.limit);
    }
  }

  showMore(): void {
    this.start = this.start + this.limit;
    _.each(this.filter(this.query), (item) => {
      this.words.push(item);
    });
  }
}
