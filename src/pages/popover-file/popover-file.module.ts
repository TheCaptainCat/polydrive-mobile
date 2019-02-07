import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverFilePage } from './popover-file';

@NgModule({
  declarations: [
    PopoverFilePage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverFilePage),
  ],
})
export class PopoverFilePageModule {}
