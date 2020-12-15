//=========== Script for Star JS ===========

// from the Zdog object extract the necessary modules
const { Illustration, Ellipse, Rect, Shape, Group, Anchor } = Zdog;

// set up the illustration within the existing canvas element
const illustration = new Illustration({
  element: "canvas",
  dragRotate: true,
});

// below the star draw a circle with a fill and no stroke, for the shadow
const shadow = new Ellipse({
  addTo: illustration,
  diameter: 100,
  stroke: false,
  fill: true,
  color: "hsla(45, 100%, 58%, 0.4)",
  translate: { x: 50, y: 100 },
  rotate: { x: Math.PI / 1.7 },
});

// include an anchor point for the star
// ! position the star atop the anchor, to have the rotation occur around this point
const starAnchor = new Anchor({
  addTo: illustration,
  translate: { y: 100 },
  rotate: { z: Math.PI / 10 },
});

// draw a star in a group element positioned atop the anchor point
const starGroup = new Group({
  addTo: starAnchor,
  translate: { x: -70, y: -170 }, // -70 to center the 140 wide shape
});

// draw the path describing the star
new Shape({
  addTo: starGroup,
  path: [
    { x: 0, y: 45 },
    { x: 45, y: 45 },
    { x: 70, y: 0 },
    { x: 95, y: 45 },
    { x: 140, y: 45 },
    { x: 105, y: 80 },
    { x: 120, y: 130 },
    { x: 70, y: 105 },
    { x: 20, y: 130 },
    { x: 35, y: 80 },
    { x: 0, y: 45 },
  ],
  stroke: 40,
  color: "hsl(45, 100%, 58%)",
});
// within the path include a rectangle to remove the gap between the center of the star and its stroke
new Rect({
  addTo: starGroup,
  width: 40,
  height: 50,
  stroke: 40,
  translate: { x: 70, y: 70 },
  color: "hsl(45, 100%, 58%)",
});

// include a group for the eyes, positioned halfway through the height of the star
const eyesGroup = new Group({
  addTo: starGroup,
  translate: { x: 70, y: 72.5, z: 20 },
});

// add black circles describing the contour of the eyes, and either end of the star
const eye = new Ellipse({
  addTo: eyesGroup,
  diameter: 5,
  stroke: 15,
  translate: { x: -32.5 },
  color: "hsl(0, 0%, 0%)",
});
eye.copy({
  translate: { x: 32.5 },
});

// add an anchor point for the white part of the eyes
// by later translating the white part of the eyes, the rotation allows to have the circle rotate around the anchor point
const leftEyeAnchor = new Anchor({
  addTo: eyesGroup,
  translate: { x: -32.5, z: 0.5 },
});
const leftEye = new Ellipse({
  addTo: leftEyeAnchor,
  diameter: 1,
  stroke: 5,
  color: "hsl(0, 100%, 100%)",
  translate: { x: -3.5 },
});

// copy the left anchor for the right side
const rightEyeAnchor = leftEyeAnchor.copyGraph({
  translate: { x: 32.5, z: 0.5 },
});

// include an anchor point for the mouth
// by centering the mouth around the anchor and scaling the anchor itself, the change in size occurs from the center of the mouth
const mouthAnchor = new Anchor({
  addTo: starGroup,
  translate: { x: 70, y: 95, z: 20 },
  scale: 0.8,
});
// draw a mouth with a line and arc commands
const mouth = new Shape({
  addTo: mouthAnchor,
  path: [
    { x: -8, y: 0 },
    { x: 8, y: 0 },
    {
      arc: [
        { x: 4, y: 6 },
        { x: 0, y: 6 },
      ],
    },
    {
      arc: [
        { x: -4, y: 6 },
        { x: -8, y: 0 },
      ],
    },
  ],
  stroke: 10,
  color: "hsl(358, 100%, 65%)",
});

illustration.updateRenderGraph();

/* to animate the star, change the transform property as follows
  
  |variableName|transform|valueRange|
  |---|---|---|
  |starAnchor|rotate.z|[Math.PI/10, -Math.PI/10]|
  |leftIrisAnchor && rightIrisAnchor|rotate.z|[0, Math.PI/2]|
  |mouthAnchor|scale|[0.8, 1.2]|
  |shadow|translate.x|[50, -50]|
  */

// ! I am positive there are much better ways to achieve this animation, but this is my take using anime.js
// I am still a newbie when it comes to animation
// create an object describing the values for the different elements
const starObject = {
  star: Math.PI / 10,
  shadow: 50,
  mouth: 0.8,
  eyes: 0,
};

// set up a repeating animation which constantly updates the illustration and updates the desired transform properties according to the object's values
const timeline = anime.timeline({
  duration: 1100,
  easing: "easeInOutQuart",
  direction: "alternate",
  loop: true,
  update: () => {
    starAnchor.rotate.z = starObject.star;
    shadow.translate.x = starObject.shadow;
    mouth.scale = starObject.mouth;
    leftEyeAnchor.rotate.z = starObject.eyes;
    rightEyeAnchor.rotate.z = starObject.eyes;

    illustration.updateRenderGraph();
  },
});

// animate the star with a slightly more pronounced easing function
timeline.add({
  targets: starObject,
  star: -Math.PI / 10,
  easing: "easeInOutQuint",
});
// have the shadow follow with a small delay
timeline.add(
  {
    targets: starObject,
    delay: 20,
    shadow: -50,
  },
  "-=1100"
);

// with a smaller duration and slightly postponed, animate the mouth and the eyes
timeline.add(
  {
    targets: starObject,
    mouth: 1.2,
    duration: 300,
  },
  "-=800"
);

timeline.add(
  {
    targets: starObject,
    eyes: Math.PI / 2,
    duration: 900,
  },
  "-=1000"
);

//=========== Script for Star JS end ===========



// //=========== Script for Fireworks ===========

// // helper functions
// const PI2 = Math.PI * 2;
// const random = (min, max) => (Math.random() * (max - min + 1) + min) | 0;
// const timestamp = (_) => new Date().getTime();

// // container
// class Birthday {
//   constructor() {
//     this.resize();

//     // create a lovely place to store the firework
//     this.fireworks = [];
//     this.counter = 0;
//   }

//   resize() {
//     this.width = canvas.width = window.innerWidth;
//     let center = (this.width / 2) | 0;
//     this.spawnA = (center - center / 4) | 0;
//     this.spawnB = (center + center / 4) | 0;

//     this.height = canvas.height = window.innerHeight;
//     this.spawnC = this.height * 0.1;
//     this.spawnD = this.height * 0.5;
//   }

//   onClick(evt) {
//     let x = evt.clientX || (evt.touches && evt.touches[0].pageX);
//     let y = evt.clientY || (evt.touches && evt.touches[0].pageY);

//     let count = random(3, 5);
//     for (let i = 0; i < count; i++)
//       this.fireworks.push(
//         new Firework(
//           random(this.spawnA, this.spawnB),
//           this.height,
//           x,
//           y,
//           random(0, 260),
//           random(30, 110)
//         )
//       );

//     this.counter = -1;
//   }

//   update(delta) {
//     ctx.globalCompositeOperation = "hard-light";
//     ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
//     ctx.fillRect(0, 0, this.width, this.height);

//     ctx.globalCompositeOperation = "lighter";
//     for (let firework of this.fireworks) firework.update(delta);

//     // if enough time passed... create new new firework
//     this.counter += delta * 3; // each second
//     if (this.counter >= 1) {
//       this.fireworks.push(
//         new Firework(
//           random(this.spawnA, this.spawnB),
//           this.height,
//           random(0, this.width),
//           random(this.spawnC, this.spawnD),
//           random(0, 360),
//           random(30, 110)
//         )
//       );
//       this.counter = 0;
//     }

//     // remove the dead fireworks
//     if (this.fireworks.length > 1000)
//       this.fireworks = this.fireworks.filter((firework) => !firework.dead);
//   }
// }

// class Firework {
//   constructor(x, y, targetX, targetY, shade, offsprings) {
//     this.dead = false;
//     this.offsprings = offsprings;

//     this.x = x;
//     this.y = y;
//     this.targetX = targetX;
//     this.targetY = targetY;

//     this.shade = shade;
//     this.history = [];
//   }
//   update(delta) {
//     if (this.dead) return;

//     let xDiff = this.targetX - this.x;
//     let yDiff = this.targetY - this.y;
//     if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
//       // is still moving
//       this.x += xDiff * 2 * delta;
//       this.y += yDiff * 2 * delta;

//       this.history.push({
//         x: this.x,
//         y: this.y,
//       });

//       if (this.history.length > 20) this.history.shift();
//     } else {
//       if (this.offsprings && !this.madeChilds) {
//         let babies = this.offsprings / 2;
//         for (let i = 0; i < babies; i++) {
//           let targetX =
//             (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0;
//           let targetY =
//             (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0;

//           birthday.fireworks.push(
//             new Firework(this.x, this.y, targetX, targetY, this.shade, 0)
//           );
//         }
//       }
//       this.madeChilds = true;
//       this.history.shift();
//     }

//     if (this.history.length === 0) this.dead = true;
//     else if (this.offsprings) {
//       for (let i = 0; this.history.length > i; i++) {
//         let point = this.history[i];
//         ctx.beginPath();
//         ctx.fillStyle = "hsl(" + this.shade + ",100%," + i + "%)";
//         ctx.arc(point.x, point.y, 1, 0, PI2, false);
//         ctx.fill();
//       }
//     } else {
//       ctx.beginPath();
//       ctx.fillStyle = "hsl(" + this.shade + ",100%,50%)";
//       ctx.arc(this.x, this.y, 1, 0, PI2, false);
//       ctx.fill();
//     }
//   }
// }

// let canvas = document.getElementById("birthday");
// let ctx = canvas.getContext("2d");

// let then = timestamp();

// let birthday = new Birthday();
// window.onresize = () => birthday.resize();
// document.onclick = (evt) => birthday.onClick(evt);
// document.ontouchstart = (evt) => birthday.onClick(evt);
// (function loop() {
//   requestAnimationFrame(loop);

//   let now = timestamp();
//   let delta = now - then;

//   then = now;
//   birthday.update(delta / 1000);
// })();

//=========== Script for Fireworks end ===========


//=========== Script for Made with love ===========

$.fn.isInViewport = function () {
  var elementTop = $(this).offset().top;
  var elementBottom = elementTop + $(this).outerHeight();
  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();
  return elementBottom > viewportTop && elementTop < viewportBottom;
};

$(function () {
  let animated = false;
  $(window).on("resize scroll", function () {
    if ($(".ml16").isInViewport()) {
      if (!animated) {
        // Wrap every letter in a span
        const textWrapper = document.querySelectorAll(".ml16");
        textWrapper[0].innerHTML = textWrapper[0].textContent.replace(
          /\S/g,
          "<span class='letter'>$&</span>"
        );

        textWrapper[1].innerHTML = textWrapper[1].textContent.replace(
          /\S/g,
          "<span class='letter'>$&</span>"
        );

        textWrapper[2].innerHTML = textWrapper[2].textContent.replace(
          /\S/g,
          "<span class='letter'>$&</span>"
        );

        anime
          .timeline({ loop: false })
          .add({
            targets: ".ml16 .letter",
            translateY: [-100, 0],
            easing: "easeInExpo",
            duration: 1400,
            delay: (el, i) => 30 * i,
          })
          .add({
            targets: ".ml16",
            opacity: 1,
            duration: 1000,
            easing: "easeInExpo",
            delay: 1000,
          });
          animated = !animated
      }
    }
  });

  $(".tlt").textillate();
});


//=========== Script for Made with Love end ===========
