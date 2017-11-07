import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
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
  type
  constructor(public loadingCtrl: LoadingController, public remoteService: RemoteServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.searchRes = {}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  search(term, type){
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

  back(){
    this.navCtrl.pop();
  }

}
