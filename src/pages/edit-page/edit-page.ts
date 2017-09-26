import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { Page } from '../page/page';
import { PagesPage } from '../pages/pages';

/**
 * Generated class for the EditPagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-page',
  templateUrl: 'edit-page.html',
})
export class EditPagePage {
  page
  categories
  userId:any
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,public toastCtrl :ToastController,public remoteService :RemoteServiceProvider) {
    this.userId=localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.page = this.navParams.get("page");
    this.getCategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPagePage');
  }

  editPage(title, description, category, page_id){
    this.remoteService.editPage(title, description, category, page_id).subscribe(res =>{
      let toast = this.toastCtrl.create({
        message: 'Page updated successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      });
      this.navCtrl.push(Page,{
        page: this.page,
      });
  }
  getCategories(){
    this.remoteService.getPagesCategories().subscribe(res =>{
      this.categories = res;
    });
  }

  deletePage(pageId, userId){
    console.log(pageId, );
    this.remoteService.deletePage(pageId, userId).subscribe(res =>{
      let toast = this.toastCtrl.create({
        message: 'Page deleted successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      });
      this.navCtrl.push(PagesPage);
  }
  back(){
    this.navCtrl.push(Page,{
      page: this.page,
    });
  }

}
