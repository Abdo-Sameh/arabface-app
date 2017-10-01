import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the SettingsPrivacyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings-privacy',
  templateUrl: 'settings-privacy.html',
})
export class SettingsPrivacyPage {

  userId
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPrivacyPage');
  }
  back()
  {
    this.navCtrl.push(SettingsPage);
  }

}
