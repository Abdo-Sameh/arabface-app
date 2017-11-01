import { Component, ViewChild } from '@angular/core';
import { IonicPage, App, NavController,PopoverController ,ToastController, NavParams ,LoadingController ,AlertController} from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { TabsPage } from '../tabs/tabs';
import { ProfilePage } from '../profile/profile';
import { PostFeatursPage } from '../post-featurs/post-featurs'
import { FriendProfilePage } from '../friend-profile/friend-profile'
import { DisplayPostPage } from '../display-post/display-post'
import { NotFound_404Page } from '../not-found-404/not-found-404';
import { MyApp } from '../../app/app.component';
//import $ from "jquery";

/**
 * Generated class for the NewsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google;

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  // @ViewChild(Nav) nav: any;
  videoURL
    feeds ;
    likes;
    likeNumbers;
    userData;
    show=true
    postToDisplay
    feedComments
    havePosted =false
    post ={ 'text' : ""}
    comment={
    'comment' : '',
    'reply' :'',
    'edited':'',
    }
    hiddenPost
    feed = { 'feedid' :""}
    userId
    userAvatar

  constructor(private app: App, public navCtrl: NavController,public popOver : PopoverController  ,public toast:ToastController, public navParams: NavParams ,public alert:AlertController,public loadingCtrl: LoadingController, public remoteService : RemoteServiceProvider) {
    if(localStorage.getItem('userDataID'))
    {
     this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "")
    }
    if(localStorage.getItem('userAvatar'))
    {
      this.userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
    }

    this.getFeedsList(this.userId);

    this.userAvatar ="http://"+this.userAvatar;


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }




getFeedsList(id,more=false,GotPosts= 30)
{
  let loading = this.loadingCtrl.create({
    content: "",
    spinner: "bubbles",
    showBackdrop: true,
  });
  loading.present()
      this.remoteService.feedsListApiCall(id,'','feed',10).subscribe(res =>{
        //////////////////// looping to get comments and their replis ////////////////////////////////
        for(let i =0 ; i < res.length;i++)
        {

                  ///////////// video url handling ////////////////////////
                  if(res[i].video_embed != '')
                  {
                      res[i].video_embed = res[i].video_embed.substring(res[i].video_embed.indexOf("src=") + 5);
                      res[i].video_embed = res[i].video_embed.substring(0, res[i].video_embed.indexOf("\""));
                      this.videoURL = res[i].video_embed;
                  }
                  ///////////////// split time string to words/////////////////

                  // res[i].time = res[i].time.split(' ');

                  /////////////////////////////////////////////////////
          let newFeedID = res[i].id
          let newFeed = res[i].answers
          this.remoteService.loadComments(newFeedID).subscribe(res2 =>{newFeed.unshift(res2)
            for(let g = 0 ;g < newFeed[0].length; g++)
              {
                this.remoteService.loadReplies(newFeed[0][g].id).subscribe(res3 => {

                  newFeed[0][g]['repliesContent']=res3

                });

              }
            });

        }
        this.feeds=res
        if(GotPosts > 30)
        {
          console.log()
          this.feeds.push(res)
        }
        loading.dismiss();
        console.log(this.feeds)

      });

}

loadMoreFeeds(feedlength)
{
  console.log(feedlength)
  this.getFeedsList(this.userId,true,feedlength)
}

///////////////////// post feed //////////////

likeFeed(userid =this.userId,feedid,postIndex)
{

  this.remoteService.likeFeedApiCall(this.userId,feedid).subscribe(res =>{

            this.feeds[postIndex].like_count=res.likes;
            this.feeds[postIndex].has_like=res.has_like;
  })


}

likeComment(userid =this.userId,commentID,postIndex,commentIndex)
{


  this.remoteService.likeCommentApiCall(this.userId,commentID).subscribe(res =>{
    this.likes = res;
    for(let i =0 ; i<this.feeds[postIndex].answers[0].length ;i++)
      {
        if(this.feeds[postIndex].answers[0][commentIndex].id == commentID)
        {
          this.feeds[postIndex].answers[0][commentIndex].like_count=this.likes.likes;
          this.feeds[postIndex].answers[0][commentIndex].has_like=this.likes.has_like;

          break
        }
      }


  })


}
likeReply(userid =this.userId,replyID,postIndex,commentIndex,replyIndex)
{

  this.remoteService.likeCommentApiCall(this.userId,replyID).subscribe(res =>{
    for(let i =0 ; i<this.feeds[postIndex].answers[0][commentIndex].repliesContent.length ;i++)
      {
          if(this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].id == replyID)
          {
            this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].like_count=res.likes;
            this.feeds[postIndex].answers[0][commentIndex].repliesContent[i].has_like=res.has_like;

            break
          }
      }


  })


}
// postFeed(userID=this.userId,postText=this.post.text)
// {
//   console.log(this.feeds)

//   let loading = this.loadingCtrl.create({
//     content: "",
//     spinner: "bubbles",

//   });
//   loading.present()
//   this.remoteService.feedPosting(userID,postText).subscribe( res => {
//     this.feeds.unshift(res.feed)
//     this.post.text= ""
//     //this.getFeedsList(this.userId);
//     loading.dismiss();
//   });

// }
commentOnFeed(postOwner,postID,whoCommented=this.userId,comment=this.comment.comment)
{
  let loading = this.loadingCtrl.create({
    content: "",
    spinner: "bubbles",  });

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
  })

}
replyOnComment(postindex,commentindex,postOwner,commentID,whoCommented=this.userId,comment=this.comment.reply)
{
  let loading = this.loadingCtrl.create({
    content: "",
    spinner: "bubbles",  });

  loading.present()
  this.remoteService.ReplyOnComment(postOwner,commentID,whoCommented,comment).subscribe(res => {


    res.postid = commentID

                this.feeds[postindex].answers[0][commentindex].repliesContent.push(res)

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
    content: "",
    spinner: "bubbles",  });
  loading.present()

    this.remoteService.profileDetailsApiCall(id,userId).subscribe(res => {
        loading.dismiss();this.userData = res ;
        console.log("---------------------------");
        res.id=id;
        console.log(res);
        console.log("----------------------------");
        if(id == userId){
          this.app.getRootNav().push(ProfilePage, {
            "userData" : res
          });
          // this.navCtrl.push(ProfilePage,{
          //   "userData" : res
          // })
        }else{
            this.remoteService.isBlocked(res.id, this.userId).subscribe(res2 => {
              if(res2.status == 1){
                this.app.getRootNav().push(NotFound_404Page, {
                  "userData" : res,
                  "blocked" : true
                });
              }else{
                this.app.getRootNav().push(FriendProfilePage, {
                  "userData" : res,
                  "blocked" : false
                });
              }
            });
        }
  });
}



edit() {
  $(document).on('click','.comment-edit',function(){
    $(this).parent().prev().find('.input-group').show();

  })
  $(document).on('click','.cancel-edit',function(){
    $(this).parent().hide();

  })

}
reply()
  {
    $(document).on('click','.comment-reply',function(){
      $(this).closest('.comment').find('.reply-input').show();

    })
    $(document).on('click','.reply-close',function(){
      $(this).closest('.reply-input').hide();

    })



    }
 //////////////////////////////////////////////
 back()
 {
   this.navCtrl.pop();
      //  this.navCtrl.push(TabsPage);
 }


   /* feed options
    which contain
    -i don't like post
    -edit post
    -delete post
    -view post
   */

    editPost()
    {
      $(document).on('click','.comment-edit',function(){
        $(this).parent().prev().find('.input-group').show();

      })
      $(document).on('click','.cancel-edit',function(){
        $(this).parent().hide();

      })
    }
    ConfirmEditPost(text,feedid)
    {
        this.remoteService.editPost(text,feedid,this.userId).subscribe((data) => {console.log(data)})
    }

    savePost(feedid)
  {
    let toast = this.toast.create({
      message: 'this post has saved !',
      duration : 2000,
      cssClass: 'alert'
    });
    toast.present();
    this.remoteService.saveItem('feed',feedid,this.userId).subscribe(res => {
      console.log(res)
    })
  }
    donotLikePost(feedid,index,userID=this.userId)
    {
      this.remoteService.hidePost(feedid,userID).subscribe(res => {
        this.hiddenPost = res.status
        if(res.status == 1 )
        {
          this.feeds.splice(index,1)

          let toast = this.toast.create({
            message: 'This post will no longer show to you',
            duration : 2000
          });
          toast.present();
        }
      })
    }
    deletePost(feedid,index,userID=this.userId)
    {
      let alert = this.alert.create({
        title: 'Delete',
        message: 'Do you want to delete this post?',

        buttons: [
          {
            text: 'Ok',
            handler: () => {

              this.remoteService.removePost(feedid,userID).subscribe(res => {
                if(res.status == 1 )
                {
                  this.feeds.splice(index,1)
                  let toast = this.toast.create({
                    message: 'You deleted this post ',
                    duration : 2000


                  });
                  toast.present();
                }
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
    deleteComment(commentId)
    {
      let alert = this.alert.create({
        title: 'Delete',
        message: 'Do you want to delete comment?',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.remoteService.removeComment(commentId,this.userId).subscribe(res => {
                if(res.status == 1 )
                {

                  let toast = this.toast.create({
                    message: 'You deleted this comment ',
                    duration : 2000

                  });
                  toast.present();
                }
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
    turnNotifications(feedid,index,feedType,userID=this.userId)
    {
      if(feedType == true)
      {
        this.remoteService.unsubscribePost(feedid,userID).subscribe((data) => { console.log(data)
        if(data.status == 1)
        {
          this.feeds[index].has_subscribed = !feedType
        }
        })

      }else {
        this.remoteService.subscribePost(feedid,userID).subscribe((data) => { console.log(data)
          if(data.status == 1)
          {
            this.feeds[index].has_subscribed = !feedType
          }
        })

      }
    }
    showPost(feed)
    {
      this.postToDisplay=feed
      console.log(this.postToDisplay)
      this.navCtrl.push(DisplayPostPage,{'post':this.postToDisplay})
    }
   //////////////////////////////////////////
 effects()
 {
   $(this).css('background-color','grey')
 }

  goToPost() {
    this.app.getRootNav().push(PostFeatursPage, {
      type: 'feed',
      type_id: ''
    });
  }
  showComments(id){
    $('#' + id).show();
    console.log('#' + id);
  }
}
