import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { Nav, IonicPage, App, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
/*
  Generated class for the FriendProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FriendProvider {

  constructor(public http: Http, public loadingCtrl: LoadingController, public remoteService: RemoteServiceProvider) {
    console.log('Hello FriendProvider Provider');
  }

  addFriend(userid, friendId){
    let res;
    this.remoteService.addFriend(userid, friendId).subscribe(res => {res = res;})
    return res;
  }

  removeFriend(){

  }

  ViewProfile(id, userId){
    // let loading = this.loadingCtrl.create({
    //   content: "Loading",
    // });
    // loading.present()
    //
    // this.remoteService.profileDetailsApiCall(id, userId).subscribe(res => {
    //   loading.dismiss(); this.userData = res;
    //   res.id = id;
    //   if (id == userId) {
    //     this.nav.push(ProfilePage, {
    //       "userData": res
    //     })
    //   } else {
    //     this.remoteService.isBlocked(res.id, this.userId).subscribe(res2 => {
    //       if (res2.status == 1) {
    //         this.nav.push(NotFound_404Page, {
    //           "userData": res,
    //           "blocked": true
    //         });
    //       } else {
    //         this.nav.push(FriendProfilePage, {
    //           "userData": res,
    //           "blocked": false
    //         });
    //       }
    //     });
    //   }
    //
    // });
  }


}
