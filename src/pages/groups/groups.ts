import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import {GroupPage} from '../group/group';

/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  groups
  userId :any;
  search
  filter
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.filter = 'all';
    this.search = '';
    this.getGroups("", "", "all", this.userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }
  getGroups(type, term=this.search, filter=this.filter, userId){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    // var element = document.getElementById("active2");
    // if(element != null){
    //   if(document.getElementById("active2").innerHTML == "My Pages"){
    //     type = "mine";
    //   }
    // }
    console.log(this.search);
    console.log(type);
    console.log(filter);
    this.remoteService.getGroups(type, term, filter, userId).subscribe(res =>{
        loading.dismiss();
        this.groups = res;
        console.log(res);
      });
  }

  joinGroup(group_id, status, userId){
    this.remoteService.joinGroup(group_id, status, userId).subscribe(res =>{
      console.log(res);
    });

  }

  groupPage(){
    this.navCtrl.push(GroupPage);
  }



  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
