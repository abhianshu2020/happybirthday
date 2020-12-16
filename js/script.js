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

//=========== Script for Made with love ===========

$.fn.isInViewport = function () {
  var elementTop = $(this).offset().top;
  var elementBottom = elementTop + $(this).outerHeight();
  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();
  return elementBottom > viewportTop && elementTop < viewportBottom;
};

let bomb_interval1 = 0;
let bomb_interval2 = 0;
let isBombRunning = false;

let hbdAudio = new Audio("./audio/hbd-bells.mp3");
let shouldAudioPlay = true;

$(function () {
  let animated = false;
  let candleTextAnimated = false;
  let bdayExplosionAnimated = false;

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

        anime
          .timeline({ loop: false })
          .add({
            targets: ".ml16 .letter",
            translateY: [-100, 0],
            easing: "easeInExpo",
            duration: 1400,
            delay: (el, i) => 35 * i,
          })
          .add({
            targets: ".ml16",
            opacity: 1,
            duration: 1000,
            easing: "easeInExpo",
            delay: 1000,
          });
        animated = !animated;
      }
    }

    if ($(".ml3").isInViewport()) {
      if (!candleTextAnimated) {
        const candleTextWrapper = document.querySelector(".ml3");
        candleTextWrapper.innerHTML = candleTextWrapper.textContent.replace(
          /\S/g,
          "<span class='letter'>$&</span>"
        );

        anime
          .timeline({ loop: false })
          .add({
            targets: ".ml3 .letter",
            opacity: [0, 1],
            easing: "easeInOutQuad",
            duration: 1000,
            delay: (el, i) => 150 * (i + 1),
          })
          .add({
            targets: ".ml3",
            opacity: 1,
            duration: 1000,
            easing: "easeInExpo",
            delay: 1000,
          });
          candleTextAnimated = !candleTextAnimated
      }
    }

    // ================

    if ($(".happy-birthday-text").isInViewport && !bdayExplosionAnimated) {
      console.log("first explosion started");
      for (let i = 1; i < 50; i++)
        setTimeout(() => {
          startDoubleExplosion(
            document.body.clientWidth / 2,
            window.innerHeight / 2
          );
        }, i * 0.1 * 1000);

      for (let i = 1; i < 25; i++) {
        const x = randomFloat(100, document.body.clientWidth);
        const y = randomFloat(100, window.innerHeight / 2);

        setTimeout(() => {
          startDoubleExplosion(x, y);
        }, 50 * 0.1 * 1000);
      }

      bdayExplosionAnimated = !bdayExplosionAnimated;
    }

    if (!$(".happy-birthday-text").isInViewport()) {
      debugger;
      console.log("Element is NOT visible. is bomb running: ", isBombRunning);
      if (isBombRunning) {
        console.log("interval stopped");
        clearInterval(bomb_interval1);
        clearInterval(bomb_interval2);
        isBombRunning = false;

        shouldPlayAudio = false;
        hbdAudio.loop = false;
      }
    }

    if ($(".happy-birthday-text").isInViewport()) {
      // code to blast firework at random intervals
      debugger;
      console.log("Element is visible. is bomb running: ", isBombRunning);
      if (!isBombRunning) {
        console.log("interval started");
        // setTimeout(() => {
        bomb_interval1 = setInterval(() => {
          const x = randomFloat(00, document.body.clientWidth);
          const y = randomFloat(0, window.innerHeight / 2);

          const x2 = randomFloat(100, document.body.clientWidth);
          const y2 = randomFloat(0, window.innerHeight / 2);

          startDoubleExplosion(x, y);
          startDoubleExplosion(x2, y2);
        }, randomFloat(300, 1000));

        bomb_interval2 = setInterval(() => {
          const x3 = randomFloat(100, document.body.clientWidth);
          const y3 = randomFloat(0, window.innerHeight / 2);

          const x4 = randomFloat(100, document.body.clientWidth);
          const y4 = randomFloat(0, window.innerHeight / 2);

          startDoubleExplosion(x3, y3);
          startDoubleExplosion(x4, y4);
        }, randomFloat(500, 1500));
        // }, 50 * 0.1 * 1000);
        isBombRunning = true;
      } // end of setting interval

      // if (shouldAudioPlay) {
      hbdAudio.loop = true;
      hbdAudio.play();
      shouldAudioPlay = false;
      // }
    }
  });
});

//=========== Script for Made with Love end ===========


console.log(` 
+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
|H|a|p|p|y| |B|i|r|t|h|d|a|y| |S|h|u|b|h|i|
+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
`)

console.log(` 
+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
|H|a|p|p|y| |B|i|r|t|h|d|a|y| |S|h|u|b|h|i|
+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
`)

console.log(` 
+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
|H|a|p|p|y| |B|i|r|t|h|d|a|y| |S|h|u|b|h|i|
+-+-+-+-+-+ +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
`)