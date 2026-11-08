importScripts("/firebase-config.js");
importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js");

if (self.DREAMS_FIREBASE_CONFIG && self.DREAMS_FIREBASE_CONFIG.apiKey) {
  firebase.initializeApp(self.DREAMS_FIREBASE_CONFIG);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const notification = payload.notification || {};
    const title = notification.title || "Dreams";
    self.registration.showNotification(title, {
      body: notification.body || "Bạn có cập nhật mới trong cộng đồng Dreams.",
      data: payload.data || {},
    });
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/";
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((window) => "focus" in window);
    if (existing) {
      existing.navigate(target);
      return existing.focus();
    }
    return clients.openWindow(target);
  }));
});
