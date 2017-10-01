import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import { SettingsPage } from '../settings/settings';
/**
 * Generated class for the SettingsNotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings-notifications',
  templateUrl: 'settings-notifications.html',
})
export class SettingsNotificationsPage {

  userId
  settings
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.settings = navParams.get('settings');
    console.log(this.settings);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsNotificationsPage');
  }

  saveSettings(){
    if(this.settings["notify-following-you"] == true){
      this.settings["notify-following-you"] == "1"
    }else{
      this.settings["notify-following-you"] == "0"
    }

    if(this.settings['notify-site-mention-you'] == true){
      this.settings['notify-site-mention-you'] == "1"
    }else{
      this.settings['notify-site-mention-you'] == "0"
    }

    if(this.settings['notify-site-tag-you'] == true){
      this.settings['notify-site-tag-you'] == "1"
    }else{
      this.settings['notify-site-tag-you'] == "0"
    }

    if(this.settings['notify-site-comment'] == true){
      this.settings['notify-site-comment'] == "1"
    }else{
      this.settings['notify-site-comment'] == "0"
    }

    if(this.settings['notify-site-reply-comment'] == true){
      this.settings['notify-site-reply-comment'] == "1"
    }else{
      this.settings['notify-site-reply-comment'] == "0"
    }

    if(this.settings['notify-site-like'] == true){
      this.settings['notify-site-like'] == "1"
    }else{
      this.settings['notify-site-like'] == "0"
    }

    if(this.settings['notify-site-share-item'] == true){
      this.settings['notify-site-share-item'] == "1"
    }else{
      this.settings['notify-site-share-item'] == "0"
    }


    this.remoteService.setSettingsNotifications(this.settings["notify-following-you"], this.settings["notify-site-mention-you"], this.settings['notify-site-tag-you'],
    this.settings['notify-site-comment'], this.settings['notify-site-reply-comment'], this.settings['notify-site-like'],this.settings['notify-site-share-item'], this.userId).subscribe(res =>{
      let toast = this.toastCtrl.create({
        message: 'Settings saved successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      });
      this.navCtrl.pop();
  }
  back()
  {
    this.navCtrl.pop();
  }

}
