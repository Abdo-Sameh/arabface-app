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
  user = {
    'first_name' : '',
    'last_name' :'',
    'email_address' : '',
    'username':'',
    'gender' : '',
    'state': '',
    'country': '',
    'city' : '',
    'bio': '',
    'birth_day' :'',
    'birth_month' : '',
    'birth_year' :''
  }
  userId
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.getUserData();
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsGeneralPage');
  }
  getUserData(){
     this.remoteService.getUserData('first_name', this.userId).subscribe(res => {this.user.first_name = res});
     this.remoteService.getUserData('last_name', this.userId).subscribe(res => {this.user.last_name = res});
     this.remoteService.getUserData('email_address', this.userId).subscribe(res => {this.user.email_address = res});
     this.remoteService.getUserData('username', this.userId).subscribe(res => {this.user.username = res});
     this.remoteService.getUserData('gender', this.userId).subscribe(res => {this.user.gender = res});
     this.remoteService.getUserData('state', this.userId).subscribe(res => {this.user.state = res});
     this.remoteService.getUserData('country', this.userId).subscribe(res => {this.user.country = res});
     this.remoteService.getUserData('city', this.userId).subscribe(res => {this.user.city = res});
     this.remoteService.getUserData('bio', this.userId).subscribe(res => {this.user.bio = res});
     this.remoteService.getUserData('birth_day', this.userId).subscribe(res => {this.user.birth_day = res});
     this.remoteService.getUserData('birth_month', this.userId).subscribe(res => {this.user.birth_month = res});
     this.remoteService.getUserData('birth_year', this.userId).subscribe(res => {this.user.birth_year = res});
  }
  saveSettings(first, last, email, username, gender, country, city, state, bio){
    console.log(first, last, email, username, gender, country, city, state, bio);
    this.remoteService.settingsGeneral(first, last, email, username, gender, country, city, state, bio, this.userId).subscribe(res => {
      let toast = this.toastCtrl.create({
        message: 'Settings saved successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.pop();
      });
  }

  back(){
    this.navCtrl.pop();
  }

}
