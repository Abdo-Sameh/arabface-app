import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { VideosPage } from '../videos/videos';


/**
 * Generated class for the EditVideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-video',
  templateUrl: 'edit-video.html',
})
export class EditVideoPage {
  userId
  constructor(public navCtrl: NavController, public navParams: NavParams, public remoteService :RemoteServiceProvider, public toastCtrl :ToastController) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditVideoPage');
  }

  editVideo(){
    // this.remoteService.editVideo().subscribe(res => {

    // });
  }

}
