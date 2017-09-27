import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Events } from 'ionic-angular';
let evnt ; 
/**
 * Generated class for the PhotoselectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-photoselection',
  templateUrl: 'photoselection.html',
  styles : ['.photoclass {border: 10px solid ;}']
})
export class PhotoselectionPage {
public url: string = 'placeholder.jpg';
selectedimage ; 
photos ; 
  constructor(public events: Events,public navCtrl: NavController, public navParams: NavParams) {
    this.photos = this.navParams.get('photourl')
    evnt = this.events ;  
    console.log(this.photos);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoselectionPage');
  }
  choose(image) {

console.log("choosed")
console.log(image.changingThisBreaksApplicationSecurity) ; 
this.selectedimage = image  ; 
  }

  navbtn () {
evnt.publish('choosed', this.selectedimage);
    console.log("selected")
    this.navCtrl.pop() ; 
  }
  checkstyle (image) {

if (image == this.selectedimage) {

  return true ; 
}else  {

  return false ; 
}
  }

}
