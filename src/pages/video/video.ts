import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { VideosPage } from '../videos/videos';

/**
 * Generated class for the VideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {

  video
  userId
  constructor(public navCtrl: NavController, public navParams: NavParams, public remoteService :RemoteServiceProvider, public toastCtrl :ToastController) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.video = this.navParams.get('video');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoPage');
  }
  editVideoPage(){
    this.navCtrl.push(VideosPage, {
      'video' : this.video
    });
  }
  deleteVideo(videoId){
    this.remoteService.deleteVideo(videoId, this.userId).subscribe(res => {
      let toast = this.toastCtrl.create({
        message: 'Video deleted successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.push(VideosPage);
    });
  }
  back(){
    this.navCtrl.pop();
  }

}
