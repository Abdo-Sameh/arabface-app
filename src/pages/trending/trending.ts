import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
/**
 * Generated class for the TrendingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-trending',
  templateUrl: 'trending.html',
})
export class TrendingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrendingPage');
  }

  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
