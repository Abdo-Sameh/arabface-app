import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import { SettingsPage } from '../settings/settings';
import { LoginPage } from '../login/login';

/**
 * Generated class for the SettingsDeletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings-delete',
  templateUrl: 'settings-delete.html',
})
export class SettingsDeletePage {

  userId
  password
  constructor(public alert:AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsDeletePage');
  }
  deleteAccount(password){
    this.remoteService.deleteAccount(this.userId, password).subscribe(res1 => {
      this.remoteService.getUserData('password', this.userId).subscribe(res2 => {
        console.log(res2);
        if(res2 == password){
          if(res1.status == "1"){
              localStorage.setItem('loggedIn', "0" );
              localStorage.setItem('userName', "" );
              localStorage.setItem('userAvatar', "" );
              localStorage.setItem('userData', "" );
              localStorage.setItem('userDataID', "" );
              localStorage.setItem('userCover', "" );
              this.navCtrl.setRoot(LoginPage);

          }
        }else{
          let alert = this.alert.create({
            title: 'Error',
            message: 'Wrong Password',
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                handler: () => {
                }
              }
            ]
          });
          alert.present();
        }
      });

    });
  }
  back(){
    this.navCtrl.pop();
  }

}
