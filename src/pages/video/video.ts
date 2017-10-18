import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { VideosPage } from '../videos/videos';
import { EditVideoPage } from '../edit-video/edit-video';
import { SocialSharing } from '@ionic-native/social-sharing';

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
  constructor(private socialSharing: SocialSharing, public navCtrl: NavController, public navParams: NavParams, public remoteService :RemoteServiceProvider, public toastCtrl :ToastController) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.video = this.navParams.get('video');
    // this.video.code = this.video.code.substr(1);
    // this.video.code = this.video.code.substring(1, this.video.code.length-1);
    // $('#display').append(this.video.code);
    console.log(this.video.code);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoPage');
  }
  editVideoPage(){
    this.navCtrl.push(EditVideoPage, {
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
  regularShare(){
    // share(message, subject, file, url)
    this.socialSharing.share(this.video.title, "Arabface", "assets/images/logo.png", this.video.video_url);
  }
  back(){
    this.navCtrl.pop();
  }

}
