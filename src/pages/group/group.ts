import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
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
  constructor(public alert:AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
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
    if(status == '0'){
      this.remoteService.joinGroup(group_id, '0', this.userId).subscribe(res =>{});
      this.group.is_member = true;
    }else{

      let alert = this.alert.create({
        title: 'Leave',
        message: 'Do you want to leave group?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.remoteService.joinGroup(group_id, '1', this.userId).subscribe(res =>{});
              this.group.is_member = false;
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      alert.present();
    }

  }

  addMembers(){
    this.navCtrl.push(InviteFriendPage, {
      group : this.group
    })
  }
  reportGroup(){
    let alert = this.alert.create({
      title: 'Report',
      inputs: [
      {
        name: 'reason',
        placeholder: 'Reason ...'
      }
    ],
      buttons: [
        {
          text: 'Send',
          handler: data => {
            this.remoteService.reportItem("group", this.group.group_url, data.reason, this.userId).subscribe(res => {
              if(res.status == "1"){
                let toast = this.toastCtrl.create({
                  message: 'Report sent successfully',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();
              }else{
                let toast = this.toastCtrl.create({
                  message: 'You have reported this group before',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();
              }
            });

          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();

  }
  back() {
    this.navCtrl.pop();
  }

}
