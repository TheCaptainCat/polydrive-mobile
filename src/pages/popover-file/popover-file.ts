import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-popover-file',
  templateUrl: 'popover-file.html',
})
export class PopoverFilePage {

  constructor(public viewCtrl: ViewController) {
  }

  quit(val: number) {
    this.viewCtrl.dismiss({
      value: val
    });
  }

}
