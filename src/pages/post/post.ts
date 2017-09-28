import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';

/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  feed 


  constructor(public navCtrl: NavController, public remoteService : RemoteServiceProvider , public navParams: NavParams) {
   this.feed=this.navParams.get('feed')
    this.remoteService.loadComments(this.feed.id).subscribe(res2 =>{
      this.feed.answers.unshift(res2) 
 
      for(let g=0 ;g <this.feed.answers[0].length;g++)
        {
          this.remoteService.loadReplies(this.feed.answers[0][g].id).subscribe(res3 => { 
            this.feed.answers[0][g]['repliesContent']=res3
            
          });
          
        }
        console.log(this.feed.answers[0])
        
      });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
    console.log(this.feed)
  }

}
