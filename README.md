# Qiscus SDK Web

**Qis**cus SDK helps you build Web Chat Application easy and fast. It uses **qis**cus server backend for the API.
There's two version of the SDK. The SDK Core Only version which you can use to build a custom chat app without opinionated view layer.
The other version is the one with `View` layer already integrated in it (in this case we're using VueJs, other view layer already on TODO list).
You can download files you need by navigating to the [release](https://github.com/qiscus/qiscus-sdk-web/releases) section.

# Quick Start
### Create a new app 
You can get `AppId` by registering one from [dashboard.qiscus.com](https://dashboard.qiscus.com)

### Integrating SDK with an existing app 
###### SDK with Integrated Widget View
This version let you add a chat widget directly into your existing HTML web pages. 
You just need to include the javascript and css files from the build directory. 
And you also need to append `<div id="qiscus-widget"></div>` tag before closing body tag. Here's sample HTML:

You can just copy and paste this into your html file and it'll work directly.

``` html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel=stylesheet href=https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css>
  <link rel="stylesheet" type="text/css" href="https://s3-ap-southeast-1.amazonaws.com/qiscus-sdk/web/v1.7.5/css/qiscus-sdk.1.7.5.css">
  <!-- add this CDN for emojione if you intend to support emoji -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/lib/js/emojione.min.js"></script>
</head>
<body>
  <div id="qiscus-widget"></div>
  <script src="https://s3-ap-southeast-1.amazonaws.com/qiscus-sdk/web/v1.7.5/js/qiscus-sdk.1.7.5.js"></script>
  <script>
     qiscus.init({
        AppId: 'DRAGONGO',
        options: {
          // When we're success login into qiscus SDK we'll have a 1-on-1 chat to guest2@qiscus.com
          // You can change this to any user you have on your AppId, e.g: contact@your_company.com, etc
          loginSuccessCallback(data) { qiscus.UI.chatTarget('guest2@qiscus.com') },
          // function below will be called when there's new message
          newMessagesCallback(data) { console.log("new message : ", data) }
        }
     });
     qiscus.setUser('guest@qiscus.com', 'password', 'Qiscus Demo');
  </script>
</body>
</html>
```
We're using two CDN here, one for emoji support and one for the icon, in this case we're using FontAwesome. The *emojione* is optional though.

If you already registered for your own AppId, just replace `dragongo` with your own `AppId`. In the example above we automatically open a chat roow with `guest2@qiscus.com` assuming that user already registered on `dragongo` AppId, if the user is not registered then it will be failed. 

On the code snippet above, we can pass several callbacks to init options, in the example we're using `loginSuccessCallback` which will be called when login is success. It'll automatically open 1-1 chat room with `guest2@qiscus.com`. There's also `newMessagesCallback` where in the example it just log what the messages are.

Here are list of available callbacks:

- loginSuccessCallback
- loginErrorCallback
- newMessagesCallback
- chatRoomCreatedCallback
- groupRoomCreatedCallback
- headerClickedCallback

Here's a video showing how you can set up sample app for qiscus SDK
[![Qiscus-SDK Howto](https://cdn.rawgit.com/qiscus/qiscus-sdk-web/master/qiscus-sdk-sample.png)](https://www.youtube.com/watch?v=x-l-TVfPiCQ)

In case you don't want to have the sdk displaying on a widget view, we can put the Chat inside a container by setting `mode` to `wide` on `init` as a parameter like this example.

```
  qiscus.init({
      AppId: 'DRAGONGO',
      mode: 'wide',
      options: {
        // When we're success login into qiscus SDK we'll have a 1-on-1 chat to guest2@qiscus.com
        // You can change this to any user you have on your AppId, e.g: contact@your_company.com, etc
        loginSuccessCallback(data) { qiscus.UI.chatTarget('guest2@qiscus.com') },
        // function below will be called when there's new message
        newMessagesCallback(data) { console.log("new message : ", data) }
      }
   });
 ```
 
 The code above will put qiscus chat inside a container. Here's a working example on [codepen](https://codepen.io/desertlion/pen/MmdRBd)

# Authentication 
### Initializing with APP_ID 
The javascript file introduce a new global variable called `qiscus`. We'll use that to initiate our chat widget.

``` javascript
  qiscus.init({
    AppId: 'DRAGONGO',
    options: {
      // put your callback here, see below on list of available callbacks
      loginSuccessCallback(data) { },
      newMessagesCallback(data) { }
    }
  });
```

### Login or register
`qiscus.setUser ( email, key, username, avatar_url )`
- `email` email used by currently logged in user
- `key` secret key for current user
- `username` username to be displayed to other participant
- `avatar_url` user avatar, fallback to default avatar if not provided

How to use:
``` javascript
  qiscus.setUser('guest@qiscus.com', 'password', 'Qiscus Demo');
```

### Updating a User Profile and Avatar 
```javascript
     qiscus.setUser('guest@qiscus.com', 'password', 'Qiscus Demo', 'https://imageurl.com/image.png');
```
Same like above, you need to call the `setUser` method then re-init the SDK by calling `qiscus.init` (see below)

# 1-to-1 Chat 
### Creating and starting 1-to-1 chat
```javascript
  qiscus.UI.chatTarget('guest2@qiscus.com')
```









