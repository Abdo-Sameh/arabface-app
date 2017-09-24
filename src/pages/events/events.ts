import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  events
  categories
  userId :any;
  search
  category

  constructor(public navCtrl: NavController, public navParams: NavParams , public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId=localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.getEvents("", "", "", this.userId);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }
  getEvents(type, categoryId, term, userId){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    // var element = document.getElementById("active");
    // if(element != null){
    //   if($( "#active1" ).hasClass( "active" )){
    //     type = "all";
    //   }else
    //   type = "mine";
    // }
    // console.log(type);
    // console.log(term);

    this.remoteService.getEvents(type, term, categoryId, userId).subscribe(res =>{
        loading.dismiss();
        this.events = res.events ;
        this.categories = res.categories;
        console.log(res);
      });
  }

  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
