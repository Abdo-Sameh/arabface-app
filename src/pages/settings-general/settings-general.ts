import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import { SettingsPage } from '../settings/settings';



/**
 * Generated class for the SettingsGeneralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings-general',
  templateUrl: 'settings-general.html',
})
export class SettingsGeneralPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsGeneralPage');
  }
  back()
  {
    this.navCtrl.push(SettingsPage);
  }

}
