// 鼠标点击特效
// let emoji = ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"];
let emoji = ["♥", "♠", "♦", "♣"];
var $html = document.getElementsByTagName("html")[0];
var $body = document.getElementsByTagName("body")[0];
$html.onclick = function (e) {
  var $elem = document.createElement("b");
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  // $elem.style.color = "#E94F06";
  $elem.style.color = "rgb(" + r + "," + g + "," + b + ")";
  $elem.style.zIndex = 9999;
  $elem.style.position = "absolute";
  $elem.style.select = "none";
  $elem.style.fontFamily = "xp";
  var x = e.pageX;
  var y = e.pageY;
  $elem.style.left = x - 10 + "px";
  $elem.style.top = y - 20 + "px";
  clearInterval(anim);
  // 填充内容
  const randomItem = emoji[(Math.random() * emoji.length) | 0];
  $elem.innerText = randomItem;

  $elem.style.fontSize = Math.random() * 5 + 16 + "px";
  $elem.style.fontFamily = "xp";
  $elem.style.userSelect = "none";
  var increase = 0;
  var anim;
  setTimeout(function () {
    anim = setInterval(function () {
      if (++increase == 150) {
        clearInterval(anim);
        $body.removeChild($elem);
      }
      $elem.style.top = y - 20 - increase + "px";
      $elem.style.opacity = (150 - increase) / 120;
    }, 8);
  }, 70);
  $body.appendChild($elem);
};
