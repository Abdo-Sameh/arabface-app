import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import {ProfilePage} from '../profile/profile';
import {MyApp} from '../../app/app.component';
//import $ from "jquery";

/**
 * Generated class for the NewsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
    feeds ;
    likes;
    likeNumbers;
    userData;
    feedComments
    post ={ 'text' : ""}
    comment={
    'comment' : ''
    }
    feed = { 'feedid' :""}
    public userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
    public ionicNamedColor: string = 'primary';
    
  constructor(public navCtrl: NavController, public navParams: NavParams ,public loadingCtrl: LoadingController, public remoteService : RemoteServiceProvider) {
    this.getFeedsList(this.userId);
    this.userAvatar ="http://"+this.userAvatar;   
    

  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }

  public toggleNamedColor(): void {
    if(this.ionicNamedColor === 'primary') { 
      this.ionicNamedColor = 'secondary'
    } else {
      this.ionicNamedColor = 'primary'
    }
  }


likeFeed(userid =this.userId,feedid)
{
//   "use strict";
//   $(".feed-box").on("click", function() {
//     console.info($(this).index())
// });
  this.remoteService.likeFeedApiCall(this.userId,feedid).subscribe(res =>{
    this.likes = res; 
    for(let i =0 ; i<this.feeds.length ;i++)
      {
          if(this.feeds[i].id == feedid)
          {
            this.feeds[i].like_count=this.likes.likes;
            break
          }
      }
    
  
  })

  
}

getFeedsList(id)
{
  let loading = this.loadingCtrl.create({
    content: "Loading",
    
  });        
  loading.present()
      this.remoteService.feedsListApiCall(id).subscribe(res =>{
        for(let i =0 ; i < res.length;i++)
        {
          let newFeedID=res[i].id
          let newFeed =res[i].answers
          this.remoteService.loadComments(newFeedID).subscribe(res2 =>{newFeed.push(res2) });
        }
        this.feeds=res
        loading.dismiss();
        console.log(this.feeds)
        
      });
      
}

commentOnFeed(postOwner,postID,whoCommented=this.userId,comment=this.comment.comment)
{
  let loading = this.loadingCtrl.create({
    content: "commenting",
  });        
  loading.present()
  this.remoteService.feedsComment(postOwner,postID,whoCommented,comment).subscribe(res => {
    
 
    res.postid = postID
    for( let x in this.feeds)
      {
        if(this.feeds[x].id == res.postid)
          {
                this.feeds[x].answers[0].push(res)
              }
      }
      this.comment.comment = ''
      loading.dismiss()
    console.log(res)
  })

}



count=1;

setColor(btn)
{
    var property = document.getElementById(btn);
    if (this.count == 0){
        property.style.color = "gray"
        this.count=1;        
    }
    else{
        property.style.color = "blue"
        this.count=0;
    }

}


///////////////////// post feed //////////////
 
postFeed(userID=this.userId,postText=this.post.text)
{
  this.remoteService.feedPosting(userID,postText).subscribe( res => { console.log(res)});

}


/////////////////////////////////////////
GoToProfile(id)
{
  let loading = this.loadingCtrl.create({
    content: "Loading",
  });        
  loading.present()

    this.remoteService.profileDetailsApiCall(id).subscribe(res =>{loading.dismiss();this.userData = res ; res.id=id;      this.navCtrl.push(ProfilePage,{"userData" : res})
  });
  
}


 //////////////////////////////////////////////
 back()
 {
       this.navCtrl.push(TabsPage);
 }
}

