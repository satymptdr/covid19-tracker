var socket = io();

socket.on('sendOnVisit', (data) => {
    const obj = JSON.parse(data);
    notifyMe(obj);
});

function notifyMe(obj) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    // Let's check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
        var options = {
            onclick: "http://abhay-covid19.herokuapp.com/india",
            body: obj.body,
            icon: obj.icon,
            vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
            sound: "https://raw.githubusercontent.com/gauntface/web-push-book/master/src/demos/notification-examples/audio/notification-sound.mp3"
        };
        var notification = new Notification(obj.title, options);
        notification.onclick = function(event) {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open('http://abhay-covid19.herokuapp.com/india', '_blank');
        }
        console.log('notification sent!');
    }
    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // Whatever the user answers, we make sure we store the information
        if (!('permission' in Notification)) {
          Notification.permission = permission;
        }
        // If the user is okay, let's create a notification
        if (permission === "granted") {
          var options = {
              body: obj.body,
              icon: obj.icon,
              vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
              sound: "https://raw.githubusercontent.com/gauntface/web-push-book/master/src/demos/notification-examples/audio/notification-sound.mp3"
          };
          var notification = new Notification(obj.title, options);
          notification.onclick = function(event) {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open('http://abhay-covid19.herokuapp.com/india', '_blank');
          } 
        }
      });
    }
    // At last, if the user already denied any notification, and you
    // want to be respectful there is no need to bother them any more.
  }