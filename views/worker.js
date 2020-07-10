console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log(data);
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
    sound: data.audio,
    data: {
      time: new Date(Date.now()).toString(),
      message: 'Stay Home, Stay Safe'
    }
  });
});