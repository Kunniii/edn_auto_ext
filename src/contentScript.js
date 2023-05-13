const notificationStyle = document.createElement("style");
notificationStyle.textContent = `
@keyframes fadein {
  from {opacity: 0; transform: translateY(-100%);}
  to {opacity: 1; transform: translateY(0);}
}

@keyframes fadeout {
  from {opacity: 1; transform: translateY(0);}
  to {opacity: 0; transform: translateY(-100%);}
}
`;

document.head.appendChild(notificationStyle);

let yOffset = 0;
let offsetAmount = 75;

let token = localStorage.getItem("token");
let myEmail = JSON.parse(atob(token.split(".")[1])).email;
const API = "https://fugw-edunext.fpt.edu.vn:8443/api/v1";

function showIndicate(text, color, seconds) {
  const notification = document.createElement("div");
  notification.style.backgroundColor = color;
  notification.style.animation = "fadein 0.5s, fadeout 2s 2s";
  notification.style.position = "fixed";
  notification.style.width = "20rem";
  notification.style.top = `${10 + yOffset}px`;
  notification.style.right = "20px";
  notification.style.padding = "20px";
  notification.style.borderRadius = "15px";
  notification.style.zIndex = "99999";
  notification.style.fontWeight = "bold";
  notification.style.color = "white";

  notification.innerHTML = text;
  document.body.prepend(notification);

  window.yOffset += offsetAmount;

  setTimeout(function () {
    document.body.removeChild(notification);
    if (window.yOffset <= 0) {
      window.yOffset = 0;
    } else {
      window.yOffset -= offsetAmount;
    }
  }, 1000 * seconds);
}
