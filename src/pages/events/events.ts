import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { TabsPage } from '../tabs/tabs';
import { CreateEventPage } from '../create-event/create-event';
import { EventPage } from '../event/event';

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
  type
  page
  constructor(public navCtrl: NavController, public navParams: NavParams , public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId=localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.type = "upcoming"
    this.category = "all"
    this.page = 1;
    this.getEvents(this.type, this.category, "", this.userId, 1);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }
  getEvents(type, categoryId, term, userId, page){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });


    $('#selectType').on('change', function () {
        categoryId = "all";

        $('#selectCat').val("all");
        console.log("hello from selectType")
    });
    this.type = type;
    this.category = categoryId;
    if(page > 1){
      this.remoteService.getEvents(type, categoryId, term , userId, page, 2).subscribe(res =>{

        if(res.events.length == 0){
            $('#more').hide();
        }
        for(let x of res.events){
          this.events.push(x);
        }
      });
      this.page = page;
    }
    else{
      this.page = page;
      loading.present()
      this.remoteService.getEvents(type, categoryId, term , userId, page, 2).subscribe(res =>{
        if(res.events.length > 0){
            $('#more').show();
        }
          loading.dismiss();
          console.log(type);
          console.log(this.category);
          console.log(term);
          this.events = res.events ;
          this.categories = res.categories;
          console.log(res);
        });

        this.search = term;
      }
  }
  createEventPage(){
    this.navCtrl.push(CreateEventPage);
  }
  goToEventPage(event){
    this.navCtrl.push(EventPage,{
      'event': event
    });
  }
  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
