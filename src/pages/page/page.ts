import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import {PagesPage} from '../pages/pages';
import {EditPagePage} from '../edit-page/edit-page';


/**
 * Generated class for the Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-page',
  templateUrl: 'page.html',
})
export class Page {
  id
  page

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {

    this.page = navParams.get("page");
    console.log(this.page);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }
  editPage(){
    this.navCtrl.push(EditPagePage,{
      page: this.page
    });
  }

  back()
  {
    this.navCtrl.push(PagesPage);
  }

}
