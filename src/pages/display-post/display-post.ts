import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { RemoteServiceProvider } from './../../providers/remote-service/remote-service';
import { TimeProvider } from './../../providers/time/time';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the DisplayPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-display-post',
  templateUrl: 'display-post.html',
})
export class DisplayPostPage {
  post
  comment = {
    'comment': '',
    'reply': ''
  }
  likes;
  hiddenPost
  likeNumbers;
  userData;
  show = true
  postToDisplay
  feedComments
  havePosted = false
  public userId = localStorage.getItem('userDataID').replace(/[^0-9]/g, "");
  userAvatar = localStorage.getItem('userAvatar').slice(8, -1);
  friendsMention
  text
  feed = { 'feedid': "" }
  constructor(public time: TimeProvider, public translate: TranslateService, public navCtrl: NavController, public popOver: PopoverController, public toast: ToastController, public navParams: NavParams, public alert: AlertController, public loadingCtrl: LoadingController, public remoteService: RemoteServiceProvider) {
    this.post = this.navParams.get('post')
    console.log(this.post)
    this.loadComments();

  }

  getTime(time) {
    return this.time.getTime(time);
  }

  postSave(privacy) {
    this.remoteService.editPost(this.post.full_message, this.post.id, this.userId, privacy).subscribe((data) => {
      console.log(data);
      this.post.privacy = privacy;
    })
  }

  likeFeed(userid = this.userId, feedid, postIndex) {

    this.remoteService.likeFeedApiCall(this.userId, this.post.id).subscribe(res => {
      this.post.like_count = res.likes;
      this.post.has_like = res.has_like;
    })

  }

  reply() {
    $(document).on('click', '.comment-reply', function() {
      $(this).closest('.comment').find('.reply-input').show();

    })
    $(document).on('click', '.reply-close', function() {
      $(this).closest('.reply-input').hide();

    })
  }

  likeComment(userid = this.userId, commentID, postIndex, commentIndex) {
    this.remoteService.likeCommentApiCall(this.userId, commentID).subscribe(res => {
      this.likes = res;
      for (let i = 0; i < this.post.answers[0].length; i++) {
        if (this.post.answers[0][commentIndex].id == commentID) {
          this.post.answers[0][commentIndex].like_count = this.likes.likes;
          this.post.answers[0][commentIndex].has_like = this.likes.has_like;
          break
        }
      }
    })
  }

  editComment(id, text, feedIndex, commentIndex) {
    this.remoteService.editComment(this.userId, id, text).subscribe(res => {
      if (res.status == 1) {
        this.post.answers[0][commentIndex].text = text;
        $('.saveComment').parent().hide();
      }
    })
  }

  loadComments() {
    let newFeedID = this.post.id
    let newFeed = this.post.answers
    this.remoteService.loadComments(newFeedID, this.userId).subscribe(res2 => {
      newFeed.unshift(res2)
      for (let g = 0; g < newFeed[0].length; g++) {
        this.remoteService.loadReplies(newFeed[0][g].id).subscribe(res3 => {
          newFeed[0][g]['repliesContent'] = res3
        });
      }
    });
    this.post.answers = newFeed;
  }

  likeReply(userid = this.userId, replyID, postIndex, commentIndex, replyIndex) {
    this.remoteService.likeCommentApiCall(this.userId, replyID).subscribe(res => {
      for (let i = 0; i < this.post.answers[0][commentIndex].repliesContent.length; i++) {
        if (this.post.answers[0][commentIndex].repliesContent[i].id == replyID) {
          this.post.answers[0][commentIndex].repliesContent[i].like_count = res.likes;
          this.post.answers[0][commentIndex].repliesContent[i].has_like = res.has_like;
          break
        }
      }
    })
  }

  commentOnFeed(postOwner, postID, whoCommented = this.userId, comment = this.comment.comment) {
    let loading = this.loadingCtrl.create({
      content: "",
      spinner: "bubbles",
    });
    loading.present()
    this.remoteService.commentOnFeeds(this.userId, postID, whoCommented, comment, 'feed').subscribe(res => {
      console.log(res)

      this.post.answers[0].push(res)
      this.comment.comment = ''
      loading.dismiss()
    })
  }

  replyOnComment(postindex, commentindex, postOwner, commentID, whoCommented = this.userId, comment = this.comment.reply) {
    let loading = this.loadingCtrl.create({
      content: "",
      spinner: "bubbles",
    });

    loading.present()
    this.remoteService.ReplyOnComment(postOwner, commentID, whoCommented, comment).subscribe(res => {
      res.postid = commentID
      this.post.answers[0][commentindex].repliesContent.push(res)
      this.remoteService.loadReplies(commentID).subscribe(res2 => { });
      this.comment.reply = ''
      loading.dismiss()
    })
  }

  getFriendsList(term = "", id) {
    console.log(term.charAt(1));
    if (term.charAt(0) == '@' && term.length > 1) {
      $('.dropdown-content').show();
      this.remoteService.friendsListApiCall(this.userId, this.userId, term.substr(1)).subscribe(res => {
        this.friendsMention = res;
        console.log(res);
      });
    }
  }

  selectedMention(username){
    this.comment.comment = "@" + username;
    $('.dropdown-content').hide();
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
        openDropdown.classList.remove('show');
    }
  }

  sharePost(feedid, userID = this.userId) {
    let alert = this.alert.create({
      title: 'share',
      message: 'Do you want to share this post on your timeline ?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.remoteService.sharePost(feedid, userID).subscribe(res => {

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

  editPost() {
    $(document).on('click', '.comment-edit', function() {
      $(this).parent().prev().find('.input-group').show();

    })
    $(document).on('click', '.cancel-edit', function() {
      $(this).parent().hide();

    })
  }
  // ConfirmEditPost(text,feedid)
  // {
  //     this.remoteService.editPost(text,feedid,this.userId).subscribe((data) => {console.log(data)})
  // }

  savePost(feedid) {
    let toast = this.toast.create({
      message: 'this post has saved !',
      duration: 2000,
      cssClass: 'alert'
    });
    toast.present();
    this.remoteService.saveItem('feed', feedid, this.userId).subscribe(res => {
      console.log(res)
    })
  }
  donotLikePost(feedid, index, userID = this.userId) {
    this.remoteService.hidePost(feedid, userID).subscribe(res => {
      this.hiddenPost = res.status
      if (res.status == 1) {
        this.post.splice(index, 1)

        let toast = this.toast.create({
          message: 'This post will no longer show to you',
          duration: 2000
        });
        toast.present();
      }
    })
  }
  deletePost(feedid, index, userID = this.userId) {
    let alert = this.alert.create({
      title: 'Delete',
      message: 'Do you want to delete this post?',

      buttons: [
        {
          text: 'Ok',
          handler: () => {

            this.remoteService.removePost(feedid, userID).subscribe(res => {
              if (res.status == 1) {
                let toast = this.toast.create({
                  message: 'You deleted this post ',
                  duration: 2000
                });
                toast.present();
                this.navCtrl.pop()
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
  deleteComment(commentId, feedIndex, commentIndex) {

    let title, reason, ok, cancel, message;
    this.translate.get('delete-comment').subscribe(value => { title = value; })
    this.translate.get('delete-comment-question').subscribe(value => { message = value; })
    this.translate.get('ok').subscribe(value => { ok = value; })
    this.translate.get('cancel').subscribe(value => { cancel = value; })

    let alert = this.alert.create({
      title: title,
      message: message,
      buttons: [
        {
          text: ok,
          handler: () => {
            this.remoteService.removeComment(commentId, this.userId).subscribe(res => {
              if (res.status == 1) {
                this.post.answers[0].splice(commentIndex, 1);
              }
            })
          }
        },
        {
          text: cancel,
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  turnNotifications(feedid, index, feedType, userID = this.userId) {
    if (feedType == true) {
      this.remoteService.unsubscribePost(feedid, userID).subscribe((data) => {
        console.log(data)
        if (data.status == 1) {
          this.post.has_subscribed = !feedType
        }
      })

    } else {
      this.remoteService.subscribePost(feedid, userID).subscribe((data) => {
        console.log(data)
        if (data.status == 1) {
          this.post.has_subscribed = !feedType
        }
      })

    }
  }
  showPost(feed) {
    this.postToDisplay = feed
    console.log(this.postToDisplay)
    this.navCtrl.push(DisplayPostPage, { 'post': this.postToDisplay })
  }
  //////////////////////////////////////////
  effects() {
    $(this).css('background-color', 'grey')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisplayPostPage');
  }

  edit(text) {
    this.text = text;
    $(document).on('click', '.comment-edit', function() {
      $(this).parent().prev().find('.input-group').show();

    })
    $(document).on('click', '.cancel-edit', function() {
      $(this).parent().hide();
    })
  }

  back() {
    this.navCtrl.pop();
  }

}
