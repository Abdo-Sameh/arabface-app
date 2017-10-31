import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { RemoteServiceProvider} from './../../providers/remote-service/remote-service';
import { VideosPage } from '../videos/videos';
import { EditVideoPage } from '../edit-video/edit-video';
import { SocialSharing } from '@ionic-native/social-sharing';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
/**
 * Generated class for the VideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {

  video
  userId
  likes
  userAvatar
  comment={
  'comment' : '',
  'reply' :'',
  'edited':'',
  }
  constructor(public loadingCtrl: LoadingController, private youtube: YoutubeVideoPlayer, public alert:AlertController, private socialSharing: SocialSharing, public navCtrl: NavController, public navParams: NavParams, public remoteService :RemoteServiceProvider, public toastCtrl :ToastController) {
    this.userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
    this.userAvatar = localStorage.getItem('userAvatar').slice(8,-1);
    this.userAvatar ="http://"+this.userAvatar;
    this.video = this.navParams.get('video');
    this.video.code = this.video.code.substring(this.video.code.indexOf("src=") + 5);
    this.video.code = this.video.code.substring(0, this.video.code.indexOf("\""));
    console.log(this.video.code);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoPage');
  }
  editVideoPage(){
    this.navCtrl.push(EditVideoPage, {
      'video' : this.video
    });
  }
  deleteVideo(videoId){
    this.remoteService.deleteVideo(videoId, this.userId).subscribe(res => {
      let toast = this.toastCtrl.create({
        message: 'Video deleted successfully',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.push(VideosPage);
    });
  }
  regularShare(){
    // share(message, subject, file, url)
    this.socialSharing.share(this.video.title, "Arabface", "assets/images/logo.png", this.video.video_url);
  }
  reportVideo(){
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
            this.remoteService.reportItem("video", this.video.video_url, data.reason, this.userId).subscribe(res => {
              if(res.status == "1"){
                let toast = this.toastCtrl.create({
                  message: 'Report sent successfully',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();
              }else{
                let toast = this.toastCtrl.create({
                  message: 'You have reported this video before',
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
  effects() {
    $(this).css('background-color','grey')
  }

  commentOnFeed(postOwner,postID,whoCommented=this.userId,comment=this.comment.comment)
  {
    let loading = this.loadingCtrl.create({
      content: "",
      spinner: "bubbles",  });
    loading.present()
    this.remoteService.commentOnFeeds(postOwner,postID,whoCommented,comment).subscribe(res => {
      res.postid = postID

      this.video.answers.push(res)


        this.remoteService.loadComments(postID).subscribe(res2 =>{ });

        this.comment.comment = ''
        loading.dismiss()
    })

  }


  likeFeed(userid = this.userId, feedid, postIndex) {
    this.remoteService.likeFeedApiCall(this.userId, this.video.id).subscribe(res =>{
        this.video.like_count = res.likes;
        this.video.has_like = res.has_like;
    })
  }

  likeComment(userid = this.userId, commentID, postIndex, commentIndex) {
    this.remoteService.likeCommentApiCall(this.userId, commentID).subscribe(res =>{
      this.likes = res;
      for(let i = 0 ; i < this.video.answers[0].length; i++)
        {
          if(this.video.answers[0][commentIndex].id == commentID)
          {
            this.video.answers[0][commentIndex].like_count = this.likes.likes;
            this.video.answers[0][commentIndex].has_like = this.likes.has_like;
            break
          }
        }
    })
  }

  sharePost(feedid, userID = this.userId) {
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

  back(){
    this.navCtrl.pop();
  }

}
