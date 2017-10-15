import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { InviteFriendPage } from '../invite-friend/invite-friend';
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
  members = {

  }
  userId :any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.group = navParams.get("group");
    this.isSaved(this.group.id);
    this.groupFeeding(this.group.id);
    this.groupMembers(this.group.id, this.userId);
    console.log(this.members);
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
  groupMembers(group_id, userid){
    this.remoteService.groupMembers(group_id, userid).subscribe(res => {
      console.log(res);
      this.members = res;
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
  joinGroup(group_id, status){
    this.remoteService.joinGroup(group_id, status, this.userId).subscribe(res =>{
      if(status == '0'){
        this.group.is_member = true;
      }else{
        this.group.is_member = false;
      }
    });

  }

  addMembers(){
    this.navCtrl.push(InviteFriendPage, {
      group : this.group
    })
  }
  back() {
    this.navCtrl.pop();
  }

}
