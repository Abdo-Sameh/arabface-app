import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { EditEventPage } from '../edit-event/edit-event';
import { EventsPage } from '../events/events';

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  userId
  event
  saved

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.event = navParams.get("event");
    this.isSaved(this.event.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }
  editEventPage(){
    this.navCtrl.push(EditEventPage,{
      'event' : this.event
    });
  }
  saveEvent(eventId){
    this.remoteService.saveItem('event', eventId, this.userId).subscribe(res=>{
      this.saved = true;
    });
  }
  unsaveEvent(eventId){
    this.remoteService.unsaveItem('event', eventId, this.userId).subscribe(res=>{
      this.saved = false;
    });
  }
  isSaved(eventId){
    this.remoteService.isSaved('event', eventId, this.userId).subscribe(res=>{
      if(res.status == 1){
        this.saved = true;
      }else{
        this.saved = false;
      }
    });
  }
  rsvp(event_id, rsvp){
    console.log(event_id, rsvp);
    this.remoteService.rsvp(event_id, rsvp, this.userId).subscribe(res => {
      this.event.rsvp = rsvp;
      console.log(res);
    });
  }
  back(){
    this.navCtrl.pop();
  }

}
