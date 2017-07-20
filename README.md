# Qiscus SDK Web

**Qis**cus SDK helps you build Web Chat Application easy and fast. It uses **qis**cus server backend for the API.
There's two version of the SDK. The SDK Core Only version which you can use to build a custom chat app without opinionated view layer.
The other version is the one with `View` layer already integrated in it (in this case we're using VueJs, other view layer already on TODO list).
You can download files you need by navigating to the [release](https://github.com/qiscus/qiscus-sdk-web/releases) section.

# Quick Start
## Create a new app 
Register on [dashboard.qiscus.com](https://dashboard.qiscus.com) using your email and password and then create new application

You should create one application per service, regardless of the platform. For example, an app released in Android, iOS or Web would require only one application to be created in the Dashboard.

All users within the same **qis**cus application are able to communicate with each other, across all platforms. This means users using iOS, Android, web clients, etc. can all chat with one another. However, users in different Qiscus applications cannot talk to each other.

Done! Now you can use the `APP_ID` into your apps and get chat functionality by implementing **qis**cus into your app.

## Integrating SDK with an existing app 
**qis**cus SDK let you add a chat widget directly into your existing HTML web pages. You just need to include the javascript and css files from the build directory. And you also need to append `<div id="qiscus-widget"></div>` tag before closing body tag. Here's sample HTML:

You can just copy and paste this into your html file and it'll work directly.

``` html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel=stylesheet href=https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css>
  <link rel="stylesheet" type="text/css" href="https://s3-ap-southeast-1.amazonaws.com/qiscus-sdk/web/v2.4.0/css/qiscus-sdk.2.4.0.css">
  <!-- add this CDN for emojione if you intend to support emoji -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.3.5/lib/js/emojione.min.js"></script>
</head>
<body>
  <div id="qiscus-widget"></div>
  <script src="https://s3-ap-southeast-1.amazonaws.com/qiscus-sdk/web/v2.4.0/js/qiscus-sdk.2.4.0.js"></script>
  <script>
     // let's setup options for our widget
     QiscusSDK.core.init({
        AppId: 'DRAGONGO',
        options: {
          // When we're success login into qiscus SDK we'll have a 1-on-1 chat to guest2@qiscus.com
          // You can change this to any user you have on your AppId, e.g: contact@your_company.com, etc
          loginSuccessCallback(data) { QiscusSDK.UI.chatTarget('guest2@qiscus.com') },
          // function below will be called when there's new message
          newMessagesCallback(data) { console.log("new message : ", data) }
        }
     });
     // login to qiscus
     QiscusSDK.core.setUser('guest@qiscus.com', 'password', 'Qiscus Demo');
     // render the widget
     QiscusSDK.render();
  </script>
</body>
</html>
```
We're using two CDN here, one for emoji support and one for the icon, in this case we're using FontAwesome. The *emojione* is optional though.

If you already registered for your own AppId, just replace `dragongo` with your own `AppId`. In the example above we automatically open a chat roow with `guest2@qiscus.com` assuming that user already registered on `dragongo` AppId, if the user is not registered then it will be failed. 

On the code snippet above, we can pass several callbacks to init options, in the example we're using `loginSuccessCallback` which will be called when login is success. It'll automatically open 1-1 chat room with `guest2@qiscus.com`. There's also `newMessagesCallback` where in the example it just log what the messages are. After that we render the widget into our page by calling `QiscusSDK.render()`

# Authentication
## Init with APP ID
We can initialize **qis**cus SDK by using this line of code:
```
QiscusSDK.core.init({
  AppId: 'DRAGONGO',
  options: {
    // When we're success login into qiscus SDK we'll have a 1-on-1 chat to guest2@qiscus.com
    // You can change this to any user you have on your AppId, e.g: contact@your_company.com, etc
    loginSuccessCallback(data) { QiscusSDK.UI.chatTarget('guest2@qiscus.com') },
    // function below will be called when there's new message
    newMessagesCallback(data) { console.log("new message : ", data) }
  }
});
```
Here are list of available callbacks:

- loginSuccessCallback
- loginErrorCallback
- newMessagesCallback
- chatRoomCreatedCallback
- groupRoomCreatedCallback
- headerClickedCallback

After we initialize the SDK, we need to set `login` data for current user by using this code:
`QiscusSDK.core.setUser('[email / unique identifer]', '[password]', '[Display Name]');`

## Updating a User Profile and Avatar
You can use the previous login code to update your data:
`QiscusSDK.core.setUser('email', 'key', 'username', 'avatar_url');`

- `email` email used by currently logged in user
- `key` secret key for current user
- `username` username to be displayed to other participant
- `avatar_url` user avatar, fallback to default avatar if not provided

# Room Types
## Creating and starting 1-to-1 chat
To create a 1-to-1 chat use this code:
`QiscusSDK.core.chatTarget('[email / unique identifier]')`

## Creating a Group Room
`QiscusSDK.core.createGroupRoom (name, ...emails)`
where `email(s)` is in the type of `array`

## Start Group Chat
`QiscusSDK.core.chatGroup('group_room_id')`

# Resources
## Video
Here's a video showing how you can set up sample app for qiscus SDK
[![Qiscus-SDK Howto](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/master/qiscus-sdk-sample.png)](https://www.youtube.com/watch?v=x-l-TVfPiCQ)

# UI Customization
In case you don't want to have the sdk displaying on a widget view, we can put the Chat inside a container by setting `mode` to `wide` on `init` as a parameter like this example.

```
  QiscusSDK.core.init({
      AppId: 'DRAGONGO',
      mode: 'wide',
      options: {
        // When we're success login into qiscus SDK we'll have a 1-on-1 chat to guest2@qiscus.com
        // You can change this to any user you have on your AppId, e.g: contact@your_company.com, etc
        loginSuccessCallback(data) { QiscusSDK.UI.chatTarget('guest2@qiscus.com') },
        // function below will be called when there's new message
        newMessagesCallback(data) { console.log("new message : ", data) }
      }
   });
 ```

 You can also enable / disable avatar by passing `avatar` options.
 
 The code above will put qiscus chat inside a container. Here's a working example on [codepen](https://codepen.io/desertlion/pen/MmdRBd)

The widget is built using vuejs and divided into several components. We also use fontawesome for the icon, so you can target fontawesome css class directly. You can change the appearance of the widget by using these css selectors below.

Widget components have namespaces of `qcw...`

| css properties | description |
|----- | ---- |
| .qcw-trigger-button | Button for toggling the chat window | 
| .qcw-container | Widget Window Wrapper div |
| .qcw-header | Widget Header containing active chat title |
| ul#messages__comments | Messages list container |
| .qcw-comment-form | Comment Form container |
| .qcw-comment-form textarea | Comment Text Input Field |
| .qcw-comment-form i | Comment Form icons (paperclip and paper-plane icon) | 
| .comment-form i | Comment Form icons (paperclip and paper-plane icon) | 








