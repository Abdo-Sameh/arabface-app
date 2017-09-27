import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController ,AlertController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import {TabsPage} from '../tabs/tabs';
import {ProfilePage} from '../profile/profile';
import {MyApp} from '../../app/app.component';
import {FriendProfilePage} from '../friend-profile/friend-profile';
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
    show=true
    feedComments
    havePosted =false
    post ={ 'text' : ""}
    comment={
    'comment' : '',
    'reply' :''
    }
    feed = { 'feedid' :""}
    public userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
    public ionicNamedColor: string = 'primary';

  constructor(public navCtrl: NavController, public navParams: NavParams ,public alert:AlertController,public loadingCtrl: LoadingController, public remoteService : RemoteServiceProvider) {
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


getFeedsList(id)
{
  let loading = this.loadingCtrl.create({
    content: "Loading",

  });
  loading.present()
      this.remoteService.feedsListApiCall(id).subscribe(res =>{
        if(this.havePosted == true)
          {

            res=this.feeds
          }
        for(let i =0 ; i < res.length;i++)
        {
          let newFeedID=res[i].id
          let newFeed =res[i].answers
          this.remoteService.loadComments(newFeedID).subscribe(res2 =>{newFeed.unshift(res2)
            for(let g=0 ;g <newFeed[0].length;g++)
              {
                this.remoteService.loadReplies(newFeed[0][g].id).subscribe(res3 => {

                  newFeed[0][g]['repliesContent']=res3

                });

              }
            });

        }
        this.feeds=res
        loading.dismiss();
        console.log(this.feeds)
      });

}


///////////////////// post feed //////////////

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
likeComment(userid =this.userId,commentID,postIndex,commentIndex)
{

//   "use strict";
//   $(".feed-box").on("click", function() {
//     console.info($(this).index())
// });
  this.remoteService.likeCommentApiCall(this.userId,commentID).subscribe(res =>{
    this.likes = res;
    for(let i =0 ; i<this.feeds[postIndex].answers[0].length ;i++)
      {
        if(this.feeds[postIndex].answers[0][commentIndex].id == commentID)
        {
          this.feeds[postIndex].answers[0][commentIndex].like_count=this.likes.likes;
          break
        }
      }


  })


}
likeReply(userid =this.userId,replyID,postIndex,commentIndex,replyIndex)
{
//   "use strict";
//   $(".feed-box").on("click", function() {
//     console.info($(this).index())
// });
  this.remoteService.likeCommentApiCall(this.userId,replyID).subscribe(res =>{
    this.likes = res;
    for(let i =0 ; i<this.feeds[postIndex].answers[0][commentIndex].repliesContent.length ;i++)
      {
          if(this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].id == replyID)
          {
            this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].like_count=this.likes.likes;
            break
          }
      }


  })


}
postFeed(userID=this.userId,postText=this.post.text)
{
  console.log(this.feeds)

  let loading = this.loadingCtrl.create({
    content: "Posting",
  });
  loading.present()
  this.remoteService.feedPosting(userID,postText).subscribe( res => {
    this.feeds.unshift(res.feed)
    console.log(this.feeds)
    this.post.text= ""
    //this.getFeedsList(this.userId);
    loading.dismiss();
  });

}
commentOnFeed(postOwner,postID,whoCommented=this.userId,comment=this.comment.comment)
{
  let loading = this.loadingCtrl.create({
    content: "commenting",
  });
  console.log(this.feeds)

  loading.present()
  this.remoteService.commentOnFeeds(postOwner,postID,whoCommented,comment).subscribe(res => {


    res.postid = postID
    for( let x in this.feeds)
      {
        if(this.feeds[x].id == res.postid)
          {
                this.feeds[x].answers[0].push(res)
              }
      }
      this.remoteService.loadComments(postID).subscribe(res2 =>{ });

      this.comment.comment = ''
      loading.dismiss()
    console.log(res)
  })

}
replyOnComment(postindex,commentindex,postOwner,commentID,whoCommented=this.userId,comment=this.comment.reply)
{
  let loading = this.loadingCtrl.create({
    content: "replying",
  });

  loading.present()
  this.remoteService.ReplyOnComment(postOwner,commentID,whoCommented,comment).subscribe(res => {

    console.log(this.feeds[postindex].answers[0][commentindex].repliesContent)
    res.postid = commentID
    for(let i =0 ; i< this.feeds[postindex].answers[0][commentindex].repliesContent.length ;i++)
          {
        if(this.feeds[postindex].answers[0][commentindex][i].id == res.postid)
          {
                this.feeds[postindex].answers[0][commentindex][i].repliesContent.push(res)
          }
      }
      this.remoteService.loadReplies(commentID).subscribe(res2 =>{ });

      this.comment.reply = ''
      loading.dismiss()
  })

}

sharePost(feedid,userID=this.userId)
{
  let alert = this.alert.create({
    title: 'share',
    message: 'Do you want to share this post on your timeline ?',
    buttons: [
      {
        text: 'Ok',
        handler: () => {
          this.remoteService.sharePost(feedid,userID).subscribe(res => {

          })
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




/////////////////////////////////////////
GoToProfile(id,userId)
{
  let loading = this.loadingCtrl.create({
    content: "Loading",
  });
  loading.present()

    this.remoteService.profileDetailsApiCall(id,userId).subscribe(res => {
        loading.dismiss();this.userData = res ;
        res.id=id;
        console.log("---------------------")
        console.log(id, userId);
        console.log("---------------------")

        if(id == userId){
          this.navCtrl.push(ProfilePage,{
            "userData" : res
          })
        }else{
          this.navCtrl.push(FriendProfilePage,{
            "userData" : res
          })
        }

  });

}

// count=1;

// setColor(btn)
// {
//     var property = document.getElementById(btn);
//     if (this.count == 0){
//         property.style.color = "gray"
//         this.count=1;
//     }
//     else{
//         property.style.color = "blue"
//         this.count=0;
//     }

// }
reply()
  {
    this.show = false;
  }
 //////////////////////////////////////////////
 back()
 {
       this.navCtrl.push(TabsPage);
 }
}
