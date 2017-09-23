import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import { SettingsGeneralPage } from '../settings-general/settings-general';
import { SettingsNotificationsPage } from '../settings-notifications/settings-notifications';
import { SettingsPasswordPage } from '../settings-password/settings-password';
import { SettingsPrivacyPage } from '../settings-privacy/settings-privacy';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  generalPage(){
    this.navCtrl.push(SettingsGeneralPage);
  }
  notificationsPage(){
    this.navCtrl.push(SettingsNotificationsPage);
  }
  passwordPage(){
    this.navCtrl.push(SettingsPasswordPage);
  }
  privacyPage(){
    this.navCtrl.push(SettingsPrivacyPage);
  }

  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
