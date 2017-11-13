import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { NotFound_404Page } from '../not-found-404/not-found-404';
import { FriendProfilePage } from '../friend-profile/friend-profile';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  searchQuery
  searchRes
  userId
  userData
  type
  constructor(public loadingCtrl: LoadingController, public remoteService: RemoteServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.searchRes = {}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  search(term, type) {
    let loading = this.loadingCtrl.create({
      content: "",
      spinner: "bubbles",
      showBackdrop: true,
    });
    loading.present()
    console.log(type);
    this.remoteService.search(term, type, this.userId).subscribe(res => {
      loading.dismiss();
      console.log(res);
      this.searchRes = res;
      this.type = type;
    })
  }

  back() {
    this.navCtrl.pop();
  }

  GoToProfile(id) {
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()

    this.remoteService.profileDetailsApiCall(id, this.userId).subscribe(res => {
      loading.dismiss(); this.userData = res;
      res.id = id;
      if (id == this.userId) {
        this.navCtrl.push(ProfilePage, {
          "userData": res
        })
      } else {
        this.remoteService.isBlocked(res.id, this.userId).subscribe(res2 => {
          if (res2.status == 1) {
            this.navCtrl.push(NotFound_404Page, {
              "userData": res,
              "blocked": true
            });
          } else {
            this.navCtrl.push(FriendProfilePage, {
              "userData": res,
              "blocked": false
            });
          }
        });
      }
    });
  }

}
