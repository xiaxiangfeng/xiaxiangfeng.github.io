/*
  使用双 Canvas 方案 - 完全分离两个动画
*/

// --- 修复后的 BubbleHeart 类（使用独立 Canvas）---
function BubbleHeart() {
  this.canvas = null;
  this.ctx = null;
  this.bubbles = [];
  this.running = false;
  this.heartbeatTime = 0;
  this.createCanvas();
}

BubbleHeart.prototype.createCanvas = function () {
  // 创建独立的 canvas 用于爱心动画
  this.canvas = document.createElement('canvas');
  this.canvas.id = 'heartCanvas';
  this.canvas.style.position = 'fixed';
  this.canvas.style.top = '0';
  this.canvas.style.left = '0';
  this.canvas.style.width = '100%';
  this.canvas.style.height = '100%';
  this.canvas.style.pointerEvents = 'none'; // 允许点击穿透
  this.canvas.style.zIndex = '10'; // 确保在花园 canvas 之上
  
  // 设置 canvas 尺寸
  this.resizeCanvas();
  
  // 添加到页面
  document.body.appendChild(this.canvas);
  this.ctx = this.canvas.getContext("2d");
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    this.resizeCanvas();
  });
};

BubbleHeart.prototype.resizeCanvas = function () {
  if (!this.canvas) return;
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
};

BubbleHeart.prototype.start = function () {
  if (this.running) return;
  this.running = true;
  this.heartbeatTime = 0;
  this.bubbles = [];
  
  this._addBubbleTimer = setInterval(() => {
    // 添加爱心气泡
    for (let i = 0; i < 2; i++) {
      this.addHeartBubble();
    }
  }, 1200);
  this._loop();
};

BubbleHeart.prototype.stop = function () {
  this.running = false;
  if (this._addBubbleTimer) {
    clearInterval(this._addBubbleTimer);
  }
};

BubbleHeart.prototype.destroy = function () {
  this.stop();
  if (this.canvas && this.canvas.parentNode) {
    this.canvas.parentNode.removeChild(this.canvas);
  }
};

BubbleHeart.prototype.addHeartBubble = function () {
  const w = this.canvas.width;
  const h = this.canvas.height;
  // 爱心从底部出现
  const x = Math.random() * w;
  const y = h + Math.random() * 50;
  const size = 6 + Math.random() * 10; // 爱心大小
  const color = `rgba(255, 105, 180, ${Math.random() * 0.5 + 0.3})`; // 粉色
  const vy = -0.6 - Math.random() * 0.4; // 向上移动
  const vx = (Math.random() - 0.5) * 0.4; // 轻微横向漂移
  const heartbeat = Math.random() * Math.PI * 2; // 心跳动画的初始相位
  this.bubbles.push({ 
    x, y, size, color, vy, vx, alpha: 1, heartbeat
  });
};

// 绘制爱心形状
BubbleHeart.prototype._drawHeart = function (x, y, size, heartbeat) {
  const scale = size / 16;
  // 心跳效果：使用正弦波产生缩放
  const pulse = 1 + 0.3 * Math.sin(heartbeat);
  const finalScale = scale * pulse;
  
  this.ctx.save();
  this.ctx.translate(x, y);
  this.ctx.scale(finalScale, finalScale);
  
  this.ctx.beginPath();
  // 使用标准心形参数方程
  for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -13 * Math.cos(t) + 5 * Math.cos(2 * t) + 2 * Math.cos(3 * t) + Math.cos(4 * t);
    
    if (t === 0) {
      this.ctx.moveTo(hx, hy);
    } else {
      this.ctx.lineTo(hx, hy);
    }
  }
  this.ctx.closePath();
  this.ctx.fill();
  this.ctx.restore();
};

BubbleHeart.prototype._loop = function () {
  if (!this.running) return;
  this.heartbeatTime++;
  this._drawBubbles();
  requestAnimationFrame(() => this._loop());
};

// 现在可以安全地清除整个 canvas
BubbleHeart.prototype._drawBubbles = function () {
  const w = this.canvas.width;
  const h = this.canvas.height;

  // 清除整个 canvas（因为是独立的 canvas）
  this.ctx.clearRect(0, 0, w, h);

  // 绘制和更新所有爱心气泡
  for (let i = this.bubbles.length - 1; i >= 0; i--) {
    let b = this.bubbles[i];
    
    // 更新气泡位置和属性
    b.x += b.vx;
    b.y += b.vy;
    b.alpha *= 0.996; // 慢慢淡出
    b.heartbeat += 0.12; // 心跳动画速度

    // 绘制爱心气泡
    this.ctx.save();
    this.ctx.globalAlpha = b.alpha;
    this.ctx.fillStyle = b.color;
    this._drawHeart(b.x, b.y, b.size, b.heartbeat);
    this.ctx.restore();

    // 移除离开屏幕或完全淡出的气泡
    if (b.y < -b.size * 2 || b.alpha < 0.01) {
      this.bubbles.splice(i, 1);
    }
  }
};

/* --- 更新后的脚本集成 --- */

var $window = $(window),
  gardenCtx,
  gardenCanvas,
  $garden,
  garden;

// 全局 BubbleHeart 实例
var bubbleHeart;

function resizeGardenCanvas() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  $garden = $("#garden");
  $garden.attr("width", width);
  $garden.attr("height", height);
  if (gardenCanvas) {
    gardenCanvas.width = width;
    gardenCanvas.height = height;
  }
}

var clientWidth = window.innerWidth;
var clientHeight = window.innerHeight;

$(function () {
  // 设置花园 canvas
  $garden = $("#garden");
  gardenCanvas = $garden[0];
  resizeGardenCanvas();
  gardenCtx = gardenCanvas.getContext("2d");
  gardenCtx.globalCompositeOperation = "lighter";
  garden = new Garden(gardenCtx, gardenCanvas);

  // 花心渲染循环
  setInterval(function () {
    garden.render();
  }, Garden.options.growSpeed);

  // 初始化爱心气泡动画（独立 canvas）
  bubbleHeart = new BubbleHeart();
});

$(window).resize(function () {
  resizeGardenCanvas();
  clientWidth = window.innerWidth;
  clientHeight = window.innerHeight;
  
  // 重新绘制花心动画
  if (typeof startHeartAnimation === "function") {
    if (garden && typeof garden.clear === "function") {
      garden.clear();
    }
    startHeartAnimation();
  }
  
  // 爱心 canvas 会自动调整大小
  if (bubbleHeart) {
    bubbleHeart.resizeCanvas();
  }
});

function getHeartPoint(angle, offsetX, offsetY, scale) {
  var t = angle / Math.PI;
  var x = 10.5 * 16 * Math.pow(Math.sin(t), 3) * scale;
  var y = -11 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
  return new Array(offsetX + x, offsetY + y);
}

var animationTimer = null; // 全局动画定时器

function startHeartAnimation() {
  if (animationTimer) {
    clearInterval(animationTimer);
    animationTimer = null;
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  const offsetX = width / 2;
  const offsetY = height / 2.2;
  const scale = Math.min(width, height) / 400;
  if (typeof Garden.setScale === "function") {
    Garden.setScale(scale);
  }
  var angle = 10;
  var heart = new Array();
  animationTimer = setInterval(function () {
    var bloom = getHeartPoint(angle, offsetX, offsetY, scale);
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
      animationTimer = null;
      showMessages();
      if (bubbleHeart) {
        bubbleHeart.start();
      }
    } else {
      angle += 0.2;
    }
  }, 50);
}

// 其他函数保持不变...
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
  var result = '<span class="digit">' + days + '</span> 天 <span class="digit">' + hours + '</span> 时 <span class="digit">' + minutes + '</span> 分 <span class="digit">' + seconds + "</span> 秒";
  $(".elapseClock").html(result);
}

function showMessages() {
  $(".messages").fadeIn(4000, function () {
    showLoveU();
  });
  $(".words").addClass("words-visible");
}

function showLoveU() {
  $(".loveu").fadeIn(3000);
}