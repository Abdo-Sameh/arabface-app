import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
import { LoginPage} from '../login/login';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  responseData :any ;
  userData = {
    "firstname":"","lastname":"","username":"","email_address":"", "password":""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams ,public toastCtrl :ToastController,public remoteService : RemoteServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  createAccount()
  {

    if(this.userData.firstname && this.userData.lastname  && this.userData.email_address && this.userData.password )
      {
        this.remoteService.signupPostData(this.userData,"signup").then((result) =>{
          this.responseData = result;
          console.log(this.responseData);
          if(this.responseData.userData){
           localStorage.setItem('userData', JSON.stringify(this.responseData) )
          this.navCtrl.push(LoginPage);
        }
        else{
          this.presentToast("Please give valid data");
        }
          
      
      
          }, (err) => {
            //Connection failed message
          });
         }
         else{
          this.presentToast("Please insert all data");
         }

  }
  mainPageNav ()
  {
  this.navCtrl.push(LoginPage);
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
