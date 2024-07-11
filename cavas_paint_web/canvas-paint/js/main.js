$(function () {
  (function () {
    var ref = document.getElementById("tools-colour-ref"),
      ctx = ref.getContext("2d"),
      grd = ctx.createLinearGradient(0, 0, 100, 0);
    grd.addColorStop(0, "#FF0000");
    grd.addColorStop(0.16, "#FFFF00");
    grd.addColorStop(0.33, "#00FF00");
    grd.addColorStop(0.5, "#00FFFF");
    grd.addColorStop(0.66, "#0000FF");
    grd.addColorStop(0.83, "#FF00FF");
    grd.addColorStop(1, "#FF0000");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 30);
  })();
  Sketch.create({
    container: document.getElementById("paintcontainer"),
    autoclear: false,
    setup: function () {
      const savedSettings = JSON.parse(localStorage.getItem("toolsSet"));
      var self = this;
      this._tool = savedSettings?.tool || "pen";
      this._size = savedSettings?.size || 3;
      $(".size-value").text(this._size);
      this._active = {
        status: false,
        time: 0,
        touches: [],
      };
      this.lineCap = "round";
      this.lineJoin = "round";

      $(".tools-size").slider({
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 50,
        value: self._size,
        slide: function (e, ui) {
          self._size = ui.value;
          $(".size-value").text(ui.value);
        },
      });
      $(".tools-colour").slider({
        orientation: "horizontal",
        min: 0,
        max: 100,
        value: savedSettings?.color || 1,
        slide: function (e, ui) {
          var x = $("#tools-colour-ref").width() * (ui.value / 100),
            colour = document
              .getElementById("tools-colour-ref")
              .getContext("2d")
              .getImageData(x, 0, 1, 1),
            red = colour.data[0].toString(16),
            green = colour.data[1].toString(16),
            blue = colour.data[2].toString(16);
          if (red.length === 1) red = "0" + red;
          if (green.length === 1) green = "0" + green;
          if (blue.length === 1) blue = "0" + blue;
          self._colour = "#" + red + green + blue;
          console.log("x", x);
        },
        create: function (e, ui) {
          var x =
              $("#tools-colour-ref").width() *
                ((savedSettings?.color || 1) / 100) || 0,
            colour = document
              .getElementById("tools-colour-ref")
              .getContext("2d")
              .getImageData(x, 0, 1, 1),
            red = colour.data[0].toString(16),
            green = colour.data[1].toString(16),
            blue = colour.data[2].toString(16);
          if (red.length === 1) red = "0" + red;
          console.log("x", x);
          if (green.length === 1) green = "0" + green;
          if (blue.length === 1) blue = "0" + blue;
          self._colour = "#" + red + green + blue;
        },
      });
      $(".tools-eraser").click(function () {
        self._erase = true;
        self._tool = "pen";
      });
      $(".tools-pen, .tools-brush").click(function () {
        self._erase = false;
      });
      $(".tools-pen").click(function () {
        self._tool = "pen";
      });
      $(".tools-brush").click(function () {
        self._tool = "brush";
      });
      $(".tools-clear").click(function () {
        self.clear();
      });
      $(".size-max").click(function () {
        self._size = 50;
        $(".tools-size").slider("value", 50);
        $(".size-value").text(50);
      });
      $(".size-min").click(function () {
        self._size = 1;
        $(".tools-size").slider("value", 1);
        $(".size-value").text(1);
      });
      $(".size-avg").click(function () {
        self._size = 25;
        $(".tools-size").slider("value", 25);
        $(".size-value").text(25);
      });
      $(".btn-red").click(function () {
        self._colour = `red`;
        $(".tools-colour").slider("value", 0);
      });
      $(".btn-green").click(function () {
        self._colour = `#15FF00`;
        $(".tools-colour").slider("value", 30);
      });
      $(".btn-blue").click(function () {
        self._colour = `blue`;
        $(".tools-colour").slider("value", 70);
      });
      $(".tools-save").click(function () {
        const localObject = {
          tool: self._tool,
          color: $(".tools-colour").slider("option", "value"),
          size: self._size,
        };
        localStorage.setItem("toolsSet", JSON.stringify(localObject));
      });
    },
    update: function () {},
    mousedown: function () {
      this._active.status = true;
      this._active.time = this.now;
      this._active.touches = this.touches;
    },
    mouseup: function () {
      this._active.status = false;
    },
    mousemove: function () {
      if (!this._active.status) return;
      this.fillStyle = this.strokeStyle = this._erase
        ? "#fafafa"
        : this._colour;
      for (var i = 0; i < this.touches.length; i++) {
        var touch = this.touches[i];
        if (this._tool == "pen" || this._tool == "brush") {
          if (this._tool == "brush") {
            var ratio = Math.round((this.now - this._active.time) / 100) / 100;
            ratio = ratio * 4;
            if (ratio > 0.9) ratio = 0.9;
            this.lineWidth = this._size * (1 - ratio);
          } else {
            this.lineWidth = this._size;
          }
          this.beginPath();
          this.moveTo(touch.ox, touch.oy);
          this.lineTo(touch.x, touch.y);
          this.stroke();
          this.closePath();
        } else if (this._tool == "line") {
        }
      }
    },
  });
});
