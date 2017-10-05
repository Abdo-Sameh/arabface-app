import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import {GroupPage} from '../group/group';
import {CreateGroupPage} from '../create-group/create-group';

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

  type
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.filter = 'all';
    this.search = '';

    this.type = "recommend";
    this.getGroups(this.type, "", this.filter, this.userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }

  getGroups(type, term, filter, userId){
    let loading = this.loadingCtrl.create({
      content: "Loading",
    });
    loading.present()

    $('#active1, #active2, #active3').click(function(){
      $('select').val("all");
      filter = "all";
      if(this.id == 'active1'){
        type = "recommend";
      }else if(this.id == 'active2'){
        type = "member";
      }else{
        type = "yours";
      }
    });
    this.type = type;
    this.filter = filter;

    // console.log(this.search);
    // console.log(type);
    // console.log(filter);
    this.remoteService.getGroups(type, term, filter, userId).subscribe(res =>{
        loading.dismiss();
        this.groups = res;
        console.log(res);
      });

      this.search="";

  }

  joinGroup(group_id, status, userId, index){
    this.remoteService.joinGroup(group_id, status, userId).subscribe(res =>{
      if(status == '0'){
        this.groups[index].is_member = true;
      }else{
        this.groups[index].is_member = false;
      }
    });

  }

  newGroup(){
    this.navCtrl.push(CreateGroupPage);
  }

  groupPage(group){
    this.navCtrl.push(GroupPage,{
      group: group,
    });
  }
  back()
  {
    this.navCtrl.push(TabsPage);
  }

}
