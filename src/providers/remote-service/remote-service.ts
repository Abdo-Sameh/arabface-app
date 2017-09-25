import { Injectable } from '@angular/core';
import {Http ,Response ,Headers,URLSearchParams  } from '@angular/http';
import { IonicPage, NavController, NavParams ,Platform } from 'ionic-angular';
import xml2js from 'xml2js';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as $ from "jquery";
/*
  Generated class for the RemoteServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

let apiURL = 'http://nilemm.com/arabface/api/89129812/';

@Injectable()
export class RemoteServiceProvider {
 public Id :number;
 deviceLanguage
 public xmlLang :any;
  constructor(public http: Http, public platform :Platform) {
    console.log('Hello RemoteServiceProvider Provider');


  }

  ///////// Login function Start ////////
  /* Function for handling user login in by   */
  loginPostData(sentData,type)
  {

    return new Promise((resolve, reject) =>{
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('username', sentData.username);
      urlSearchParams.append('password', sentData.password);
      let body = urlSearchParams.toString()
      this.http.post(apiURL+type, body, {headers: headers}).
      subscribe(res =>{
        resolve(res.json());
      }, (err) =>{
        reject(err);
      });

    });
  }

    ///////// Login function End ////////

    ///////// Signup function Start ////////

  signupPostData(sentData,type){
    return new Promise((resolve, reject) =>{
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('firstname', sentData.firstname);
      urlSearchParams.append('lastname', sentData.lastname);
      urlSearchParams.append('username', sentData.firstname+sentData.lastname);
      urlSearchParams.append('email_address', sentData.email_address);
      urlSearchParams.append('password', sentData.password);

      let body = urlSearchParams.toString()
      this.http.post(apiURL+type, body, {headers: headers}).
      subscribe(res =>{
        resolve(res.json());
      }, (err) =>{
        reject(err);
      });

    });
  }
    ///////// Signup function End ////////

  getPhotos()
   {

          return  this.http.get("http://nilemm.com/arabface/api/89129812/page/browse")
          .do((res : Response ) => console.log(res.json()))
          .map((res : Response ) => res.json());

   }



    ///////// Friends function Start ////////
   friendsListApiCall(id)
   {

    return  this.http.get('http://nilemm.com/arabface/api/89129812/profile/friends?userid='+id)
    //.do((res : Response ) => console.log(res.json()))
    .map((res : Response ) => res.json());
   }
   ///////// Friends function End ////////


    ///////// Friends Request function Start ////////
    friendsRequestListApiCall(id)
    {

     return  this.http.get('http://nilemm.com/arabface/api/89129812/friend/requests?userid='+id)
     //.do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());
    }
    ///////// Friends Request function End ////////



    ///////// Friends Request function Start ////////
    friendsSuggestionListApiCall(id)
    {

     return  this.http.get('http://nilemm.com/arabface/api/89129812/friend/suggestions?userid='+id)
     //.do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());
    }
    ///////// Friends Request function End ////////

   ////////// Feeds function Start ///////////

   feedsListApiCall(id)
   {
    let url = "http://nilemm.com/arabface/api/89129812/feeds?limit=1000&userid="+id;
    console.log(url);
    return  this.http.get(url)
    //do((res : Response ) => console.log(res.json()))
    .map((res : Response ) => res.json());

   }
   ////////// Feeds function End             ///////////

   //////////  profile Api function start   ///////////

   profileDetailsApiCall(id)
   {
     let url = "http://nilemm.com/arabface/api/89129812/profile/details?userid="+id;
     return  this.http.get(url)
     //.do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());

   }

    //////////  profile api  function End ///////////////
    profilePosts(id)
   {
    return  this.http.get("http://nilemm.com/arabface/api/89129812/feeds?type=timeline&limit=1200&type_id="+id)
    .map((res : Response ) => res.json());
   }

    //////////  messages api  function End ///////////////

    messagesApiCall(id)
    {
      let url = "http://nilemm.com/arabface/api/89129812/chat/conversations?userid="+id;
     return  this.http.get(url)
     //.do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());

    }

    //////////  messages api  function End ///////////////



   ////////// likes Api call function start  ////////////


   likeFeedApiCall(UserID,FeedID):any
  {

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('userid', UserID );
      urlSearchParams.append('type', "feed");
      urlSearchParams.append('type_id',FeedID );


      let body = urlSearchParams.toString()
     return this.http.post("http://nilemm.com/arabface/api/89129812/like/item", body, {headers: headers})
      //do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());



  }

  ///////////// likes Api call function End  ////////////////////

  ///////////// chat messages Api call function start  ////////////////////

    usersCoversation(cID,userID):any
    {
      return this.http.get("http://nilemm.com/arabface/api/89129812/chat/get/messages?cid="+cID+"&userid="+userID).
      do((res : Response ) => console.log(res.json()))
     .map((res : Response ) => res.json());
    }


   ///////////// chat messages Api call function end  ////////////////////


  ///////////  Send Messages between users start  ////////////


   ChatMessagesSend(cID,userID,msg):any
   {
    return this.http.get("http://nilemm.com/arabface/api/89129812/chat/send/message?text="+msg+"&cid="+cID+"&userid="+userID).
    do((res : Response ) => console.log(res.json()))
   .map((res : Response ) => res.json());
   }

  ///////////  Send Messages between users End  ////////////

   ///////////// user photos Api call function start  ////////////////////

   userPhotosAlbumOnProfile(userID : number) :any
   {
     return this.http.get("http://nilemm.com/arabface/api/89129812/profile/photos?the_userid="+userID).
     do((res : Response ) => console.log(res.json()))
    .map((res : Response ) => res.json());
   }


  ///////////// user photos Api call function end  ////////////////////



   ///////////// user profile page changing Api call function start  ////////////////////

   changeProfilePicture(userID : number , path) :any
   {
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('path', path.path);
    let body = urlSearchParams.toString()
     return this.http.get("http://nilemm.com/arabface/api/89129812/profile/change/avatar?userid="+userID).
     do((res : Response ) => console.log(res.json()))
    .map((res : Response ) => res.json());
   }


  /////////////user profile page changing Api call function end  ////////////////////


  //////////// post in feed ///////////////////////
  feedPosting(userID,post)
  {

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userid', userID );
    urlSearchParams.append('entity_id', userID );
    urlSearchParams.append('text', post);
    urlSearchParams.append('type', "feed" );
    urlSearchParams.append('entity_type', "user" );
    let body = urlSearchParams.toString()

   return this.http.post("http://nilemm.com/arabface/api/89129812/feed/add", body, {headers: headers})
    //do((res : Response ) => console.log(res.json()))
   .map((res : Response ) => res.json());


  }

  ////////////////////////////////////////////////


  //////////// post in feed ///////////////////////
  profilePost(userID,post)
  {

    console.log(userID,post)
    let url = "http://nilemm.com/arabface/api/89129812/feed/add?type=feed&entity_type=user&text="+post+"&entity_id="+userID ;
console.log(url)
   return this.http.get("http://nilemm.com/arabface/api/89129812/feed/add?type=feed&entity_type=user&text=ppppp&entity_id=25")
  .map((res : Response ) => res.json());
  }

  ////////////////////////////////////////////////

  ////////////// get notifications /////////////////
  getNotifications(userid)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/notifications?limit=13&userid="+userid)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }

  //////////////////////////////////////////////

  //////////////////// load comments ////////////////////

  loadComments(feedid)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/comment/load?type=feed&limit=10&type_id="+feedid)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }


  loadProfileComments(feedid)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/comment/load?type=feed&limit=5&type_id="+feedid)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }

  // feedposting (userID,post) :any {
  //     return new Promise ((resolve )=> {
  //       var settings = {
  //         "async": true,
  //         "crossDomain": true,
  //         "url": "http://nilemm.com/arabface/api/89129812/feed/add?type=feed&entity_type=user&text="+post+"&entity_id="+userID,
  //         "method": "GET",
  //         "headers": {
  //           "x-devtools-emulate-network-conditions-client-id": "964b73d8-9467-4f26-bff0-ddb7029125a0",
  //           "accept-language": "en-US,en;q=0.8",
  //           "cache-control": "no-cache",
  //         }
  //       }

  //       $.ajax(settings).done(function (response) {
  //         console.log(response);
  //           resolve(response)

  //       });
  //     })
  // }



  /////////////////////////////////////////////////////

  feedsComment(postOwner,postID,whoCommented,comment)
  {
    return this.http.get("http://nilemm.com/arabface/api/89129812/comment/add?userid="+whoCommented+"&entity_id="+postOwner+"&entity_type=user&text="+comment+"&type=feed&type_id="+postID)
    //do((res : Response ) => console.log(res.json()))
      .map((res : Response ) => res.json());
  }



   //////////////////// add friend ////////////////////

   addFriend(userid,friendID)
   {
     return this.http.get("http://nilemm.com/arabface/api/89129812/friend/add?userid="+userid+"&to_userid="+friendID)
     //do((res : Response ) => console.log(res.json()))
       .map((res : Response ) => res.json());
   }



   /////////////////////////////////////////////////////
     //////////////////// load comments ////////////////////

     ConfirmFriendRequest(userid,friendID)
     {
       return this.http.get("http://nilemm.com/arabface/api/89129812/friend/confirm?userid="+userid+"&to_userid="+friendID)
       //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
     }



     /////////////////////////////////////////////////////
       //////////////////// load comments ////////////////////

       deleteFriendRequest(userid,friendID)
       {
         return this.http.get("http://nilemm.com/arabface/api/89129812/friend/remove?userid="+userid+"&to_userid="+friendID)
         //do((res : Response ) => console.log(res.json()))
           .map((res : Response ) => res.json());
       }



       /////////////////////////////////////////////////////
        onlineFriends(userid)
        {
           return this.http.get("http://nilemm.com/arabface/api/89129812/friend/online?userid="+userid)
        //do((res : Response ) => console.log(res.json()))
          .map((res : Response ) => res.json());

        }
        /////////////// get  pages /////////////////////////
        getPages(type, term, categoryId, userId){
          return this.http.get("http://nilemm.com/arabface/api/89129812/page/browse?type=" + type + "&term=" + term + "&category_id=" + categoryId + "&userid=" + userId)
          .map((res : Response ) => res.json());
        }

        getPagesCategories(){
          return this.http.get("http://nilemm.com/arabface/api/89129812/page/get/categories")
          .map((res : Response ) => res.json());
        }

        /////////////// create  page /////////////////////////
        createPage(title, description, category, userId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('userid', userId );
          urlSearchParams.append('title', title);
          urlSearchParams.append('description', description );
          urlSearchParams.append('category', category );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/page/create", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }

        editPage(title, description, category, pageId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('page_id', pageId );
          urlSearchParams.append('title', title);
          urlSearchParams.append('description', description );
          urlSearchParams.append('category', category );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/page/edit", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }

        likePage(userId, pageId, type):any{
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('userid', userId );
          urlSearchParams.append('type', "page");
          urlSearchParams.append('type_id',pageId );
          let body = urlSearchParams.toString()
          if(type == "like")
         return this.http.post("http://nilemm.com/arabface/api/89129812/like/item", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
         else
         return this.http.post("http://nilemm.com/arabface/api/89129812/dislike/item", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }

        deletePage(pageId, userId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('page_id', pageId );
          urlSearchParams.append('userid', userId );
          let body = urlSearchParams.toString()
         return this.http.post("http://nilemm.com/arabface/api/89129812/page/delete", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }



        getGroups(type, term, filter, userId){
            return this.http.get("http://nilemm.com/arabface/api/89129812/group/browse?type=" + type + "&term=" + term + "&filter=" + filter + "&userid=" + userId)
            .map((res : Response ) => res.json());

        }

        createGroup(title, description, name, privacy, userId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('userid', userId );
          urlSearchParams.append('title', title);
          urlSearchParams.append('description', description );
          urlSearchParams.append('name', name );
          urlSearchParams.append('privacy', privacy );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/group/create", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }
        editGroup(title, description, privacy, groupId, canPost, canAddMember){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('group_id', groupId );
          urlSearchParams.append('title', title);
          urlSearchParams.append('description', description );
          urlSearchParams.append('name', title );
          urlSearchParams.append('privacy', privacy );
          urlSearchParams.append('who_can_post', canPost );
          urlSearchParams.append('who_can_add_member', canAddMember );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/group/edit", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }

        deleteGroup(groupId){
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('group_id', groupId );
          let body = urlSearchParams.toString()
         return this.http.post("http://nilemm.com/arabface/api/89129812/group/delete", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }

        joinGroup(group_id, status, userid):any{
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('userid', userid );
          urlSearchParams.append('status', status);
          urlSearchParams.append('group_id', group_id );
          let body = urlSearchParams.toString()

         return this.http.post("http://nilemm.com/arabface/api/89129812/group/join", body, {headers: headers})
          //do((res : Response ) => console.log(res.json()))
         .map((res : Response ) => res.json());
        }

        groupFeeding(id){
          return this.http.get("http://nilemm.com/arabface/api/89129812/feeds?type=group&type_id="  + id)
          .map((res : Response ) => res.json());
        }


        getEvents(type, categoryId, term, userId){
          if(type == ""){
            return this.http.get("http://nilemm.com/arabface/api/89129812/event/browse?userid=" + userId + "&term=" + term + "&category_id=" + categoryId)
            .map((res : Response ) => res.json());
          }else{

          }
          return this.http.get("http://nilemm.com/arabface/api/89129812/event/browse?userid=" + userId + "&term=" + term + "&category_id=" + categoryId + "&type=" + type)
          .map((res : Response ) => res.json());
        }


        getVideos(categoryId, term, type, filter, userId){
          return this.http.get("http://nilemm.com/arabface/api/89129812/videos/browse?userid=" + userId + "&term=" + term + "&category_id=" + categoryId + "&type=" + type + "&filter=" + filter)
          .map((res : Response ) => res.json());
        }



}
