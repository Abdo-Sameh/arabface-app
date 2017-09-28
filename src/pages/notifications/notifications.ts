import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { PostPage} from '../post/post'
/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  public userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  notifications;
  
  constructor(public navCtrl: NavController, public navParams: NavParams , public remoteService : RemoteServiceProvider , public loading: LoadingController) {
    this.getNotifications(this.userId)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }


  getNotifications(userid)
  {
    let loading = this.loading.create({
      content: "Loading",
    });        
    loading.present()  
    this.remoteService.getNotifications(userid).subscribe(res => { loading.dismiss();console.log(res);this.notifications=res});
  }

  displayPost(feed)
  { console.log(feed[0].id)
    this.navCtrl.push(PostPage , { 'feed' : feed[0]})

  }
}
