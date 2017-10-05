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
  settings
  userId
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.settings = navParams.get('settings');
    // if (this.settings['who-can-view-profile'] == "1")
    //   this.settings['who-can-view-profile'] = "all";
    // else if(this.settings['who-can-view-profile'] == "2")
    //   this.settings['who-can-view-profile'] = "friends";
    // else
    //   this.settings['who-can-view-profile'] = "me";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPrivacyPage');
  }
  whoCanViewProfile(temp){
    if(temp == "all"){
      this.settings['who-can-view-profile'] = "1";
    }else if(temp == "friends"){
      this.settings['who-can-view-profile'] = "2";
    }else{
      this.settings['who-can-view-profile'] = "3";
    }
  }
  whoCanPostProfile(temp){
    if(temp == "all"){
      this.settings['who-can-psot-profile'] = "1";
    }else if(temp == "friends"){
      this.settings['who-can-post-profile'] = "2";
    }else{
      this.settings['who-can-psot-profile'] = "3";
    }
  }
  whoCanSeeBirth(temp){
    if(temp == "all"){
      this.settings['who-can-see-birth'] = "1";
    }else if(temp == "friends"){
      this.settings['who-can-see-birth'] = "2";
    }else{
      this.settings['who-can-see-birth'] = "3";
    }
  }
  whoCanSendMessage(temp){
    if(temp == "all"){
      this.settings['who-can-send-message'] = "1";
    }else if(temp == "friends"){
      this.settings['who-can-send-message'] = "2";
    }else{
      this.settings['who-can-send-message'] = "3";
    }
  }
  whoCanSeeVisitors(temp){
    if(temp == "all"){
      this.settings['who-can-see-visitors'] = "1";
    }else if(temp == "friends"){
      this.settings['who-can-see-visitors'] = "2";
    }else{
      this.settings['who-can-see-visitors'] = "3";
    }
  }
  emailNotifications(temp){
    if(temp == "all"){
      this.settings['email-notification'] = "1";
    }else if(temp == "friends"){
      this.settings['email-notification'] = "2";
    }else{
      this.settings['email-notification'] = "3";
    }
  }
  settingsPrivacy(wcvp, wcpp, wcsb, wcsm, wcsv, en){
    if(en == true){
      this.settings["notify-following-you"] == "1"
      en = "1"
    }else{
      this.settings["notify-following-you"] == "0"
      en = "0"
    }
    this.remoteService.settingsPrivacy(wcvp, wcpp, wcsb, wcsm, wcsv, en, this.userId).subscribe(res => {
      console.log(res);
    });
  }
  back(){
    this.navCtrl.pop();
  }

}
