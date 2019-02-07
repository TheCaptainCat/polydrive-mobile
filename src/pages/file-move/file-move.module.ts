import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FileMovePage } from './file-move';

@NgModule({
  declarations: [
    FileMovePage,
  ],
  imports: [
    IonicPageModule.forChild(FileMovePage),
  ],
})
export class FileMovePageModule {}
