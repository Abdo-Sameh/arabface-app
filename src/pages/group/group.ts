import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';

import {GroupsPage} from '../groups/groups';
import {EditGroupPage} from '../edit-group/edit-group';


/**
 * Generated class for the GroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {

  group
  posts
  saved
  userId :any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.group = navParams.get("group");
    this.isSaved(this.group.id);
    this.groupFeeding(this.group.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPage');
  }

  groupFeeding(id){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()
    this.remoteService.groupFeeding(id).subscribe(res =>{
        loading.dismiss();
        this.posts = res;
      });
  }

  editGroup(){
    this.navCtrl.push(EditGroupPage,{
      group: this.group,
    });
  }
  saveGroup(groupId){
    this.remoteService.saveItem('group', groupId, this.userId).subscribe(res=>{
      this.saved = true;
    });
  }
  unsaveGroup(groupId){
    this.remoteService.unsaveItem('group', groupId, this.userId).subscribe(res=>{
      this.saved = false;
    });
  }
  isSaved(groupId){
    this.remoteService.isSaved('group', groupId, this.userId).subscribe(res=>{
      if(res.status == 1){
        this.saved = true;
      }else{
        this.saved = false;
      }
    });
  }
  back()
  {
    this.navCtrl.push(GroupsPage);
  }

}
