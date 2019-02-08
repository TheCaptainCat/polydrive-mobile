import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-popover-file',
  templateUrl: 'popover-file.html',
})
export class PopoverFilePage {

  isSharedPage: boolean;

  constructor(
    public viewCtrl: ViewController,
    private navParams: NavParams
    ) {
      this.isSharedPage = this.navParams.get('isSharedPage');
  }

  quit(val: number) {
    this.viewCtrl.dismiss({
      value: val
    });
  }

}
