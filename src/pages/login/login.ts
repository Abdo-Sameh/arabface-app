import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
//import { FirebaseProvider } from './../../providers/firebase/firebase2';
import { SignupPage } from './../signup/signup';
import { TabsPage } from './../tabs/tabs';

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormControl , FormGroup , Validators } from '@angular/forms'
let firebase ; 
// import stylefile from '../assets/main.css' ; 
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls : ['../../assets/main.css']
})
export class LoginPage {
email ; 
password ; 
  constructor(public database : RemoteServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
  firebase = this.database ; 
}

  userForm = new FormGroup ({
     
      username : new FormControl (null , [Validators.required , Validators.email]) , 
      
      password : new FormControl (null , [Validators.required]) , 
     

  });

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  login () {
     // console.log(this.userForm.value)
    
     
    firebase.login(this.userForm.value)
  }
  validateEmail(email) {
    console.log(email)
    if(email == ""){return true ; }
  if(email==null){return true ; }
     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(re.test(email))
    return re.test(email);
}
creat () {
  this.navCtrl.push(SignupPage) ; 
}
out() {

  firebase.signout () ; 
}
}