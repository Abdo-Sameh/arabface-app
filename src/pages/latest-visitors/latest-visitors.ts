import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
/**
 * Generated class for the LatestVisitorsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-latest-visitors',
  templateUrl: 'latest-visitors.html',
})
export class LatestVisitorsPage {
  visitors
  userId
  constructor(public navCtrl: NavController, public navParams: NavParams ,public loadingCtrl :LoadingController, public remoteService : RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.getProfileVisitors(10);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LatestVisitorsPage');
  }

  getProfileVisitors(limit){
    this.remoteService.getProfileVisitors(this.userId, limit).subscribe(res => {
      console.log(res);
      this.visitors = res;
    })
  }
  back(){
    this.navCtrl.pop();
  }

}
