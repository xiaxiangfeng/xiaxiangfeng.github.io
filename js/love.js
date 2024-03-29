﻿var $window = $(window),
  gardenCtx,
  gardenCanvas,
  $garden,
  garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
  // setup garden
  $garden = $("#garden");
  gardenCanvas = $garden[0];
  gardenCanvas.width = $("#garden").width();
  gardenCanvas.height = $("#garden").height();
  gardenCtx = gardenCanvas.getContext("2d");
  gardenCtx.globalCompositeOperation = "lighter";
  garden = new Garden(gardenCtx, gardenCanvas);

  // renderLoop
  setInterval(function () {
    garden.render();
  }, Garden.options.growSpeed);
});

$(window).resize(function () {
  var newWidth = $(window).width();
  var newHeight = $(window).height();
  if (newWidth != clientWidth && newHeight != clientHeight) {
    location.replace(location);
  }
});

function getHeartPoint(angle, offsetX, offsetY) {
  var t = angle / Math.PI;
  var x = 10.5 * 16 * Math.pow(Math.sin(t), 3);
  var y =
    -11 *
    (13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t));
  return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
  const offsetX = $("#garden").width() / 2;
  const offsetY = $("#garden").height() / 2;
  var interval = 50;
  var angle = 10;
  var heart = new Array();
  var animationTimer = setInterval(function () {
    var bloom = getHeartPoint(angle, offsetX, offsetY);
    var draw = true;
    for (var i = 0; i < heart.length; i++) {
      var p = heart[i];
      var distance = Math.sqrt(
        Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2)
      );
      if (distance < Garden.options.bloomRadius.max * 1.3) {
        draw = false;
        break;
      }
    }
    if (draw) {
      heart.push(bloom);
      garden.createRandomBloom(bloom[0], bloom[1]);
    }
    if (angle >= 30) {
      clearInterval(animationTimer);
      showMessages();
    } else {
      angle += 0.2;
    }
  }, interval);
}

(function ($) {
  $.fn.typewriter = function () {
    this.each(function () {
      var $ele = $(this),
        str = $ele.html(),
        progress = 0;
      $ele.html("");
      var timer = setInterval(function () {
        var current = str.substr(progress, 1);
        if (current == "<") {
          progress = str.indexOf(">", progress) + 1;
        } else {
          progress++;
        }
        $ele.html(str.substring(0, progress) + (progress & 1 ? "_" : ""));
        if (progress >= str.length) {
          clearInterval(timer);
        }
      }, 75);
    });
    return this;
  };
})(jQuery);

function timeElapse(date) {
  var current = Date();
  var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
  var days = Math.floor(seconds / (3600 * 24));
  seconds = seconds % (3600 * 24);
  var hours = Math.floor(seconds / 3600);
  if (hours < 10) {
    hours = "0" + hours;
  }
  seconds = seconds % 3600;
  var minutes = Math.floor(seconds / 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  seconds = seconds % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var result =
    '<span class="digit">' +
    days +
    '</span> 天 <span class="digit">' +
    hours +
    '</span> 时 <span class="digit">' +
    minutes +
    '</span> 分 <span class="digit">' +
    seconds +
    "</span> 秒";
  $(".elapseClock").html(result);
}

function showMessages() {
  $(".messages").fadeIn(4000, function () {
    showLoveU();
  });
}

function showLoveU() {
  $(".loveu").fadeIn(3000);
}
