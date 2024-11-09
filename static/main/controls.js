import { drawBlock, drawTempBlock, removeTempBlock } from "./drawBlock.js";
import { onMouseDownCreateBlock, onMouseDownDestoryBlock, toggleMouseState } from "./mouseClicks.js";
import { redrawObjects } from './redrawObjects.js';
import { selectedObject } from './raycaster.js';
// const gameObjects = gameObjects;
// const blockMeshInstanceIDKeys = blockMeshInstanceIDKeys;

///////////////////// JOYSTICKS //////////////////
export let leftJoystick = undefined;
export let leftJoystickBoundingBox = undefined;
export let leftJoystickSymbol = undefined;
export let leftJoystickSymbolBoundingBox = undefined;
export let leftJoystickXPercent = 0;
export let leftJoystickYPercent = 0;

export let rightJoystick = undefined;
export let rightJoystickBoundingBox = undefined;
export let rightJoystickSymbol = undefined;
export let rightJoystickSymbolBoundingBox = undefined;
export let rightJoystickXPercent = 0;
export let rightJoystickYPercent = 0;

export let middleJoystick = undefined;
export let middleJoystickBoundingBox = undefined;
export let middleJoystickSymbol = undefined;
export let middleJoystickSymbolBoundingBox = undefined;
export let middleJoystickXPercent = 0;
export let middleJoystickYPercent = 0;

export let middle2Joystick = undefined;
export let middle2JoystickBoundingBox = undefined;
export let middle2JoystickSymbol = undefined;
export let middle2JoystickSymbolBoundingBox = undefined;
export let middle2JoystickXPercent = 0;
export let middle2JoystickYPercent = 0;

export let middleItemTouch = undefined;

export let isOrientationActive = false;

export function updateJoystickSymbols() {
  let leftJoystickSymbolTop =
    leftJoystickBoundingBox.top +
    leftJoystickBoundingBox.height / 2 -
    leftJoystickSymbolBoundingBox.height / 2;
  leftJoystickSymbolTop -=
    (leftJoystickYPercent *
      (leftJoystickBoundingBox.height -
        leftJoystickSymbolBoundingBox.height)) /
    2;

  let leftJoystickSymbolLeft =
    leftJoystickBoundingBox.left +
    leftJoystickBoundingBox.width / 2 -
    leftJoystickSymbolBoundingBox.width / 2;
  leftJoystickSymbolLeft +=
    (leftJoystickXPercent *
      (leftJoystickBoundingBox.width -
        leftJoystickSymbolBoundingBox.width)) /
    2;

  $("#leftJoystickSymbol").css({
    top: leftJoystickSymbolTop,
    left: leftJoystickSymbolLeft,
    position: "absolute"
  });

  let rightJoystickSymbolTop =
    rightJoystickBoundingBox.top +
    rightJoystickBoundingBox.height / 2 -
    rightJoystickSymbolBoundingBox.height / 2;
  rightJoystickSymbolTop -=
    (rightJoystickYPercent *
      (rightJoystickBoundingBox.height -
        rightJoystickSymbolBoundingBox.height)) /
    2;

  let rightJoystickSymbolLeft =
    rightJoystickBoundingBox.left +
    rightJoystickBoundingBox.width / 2 -
    rightJoystickSymbolBoundingBox.width / 2;
  rightJoystickSymbolLeft +=
    (rightJoystickXPercent *
      (rightJoystickBoundingBox.width -
        rightJoystickSymbolBoundingBox.width)) /
    2;

  $("#rightJoystickSymbol").css({
    top: rightJoystickSymbolTop,
    left: rightJoystickSymbolLeft,
    position: "absolute"
  });

  let middleJoystickSymbolTop =
    middleJoystickBoundingBox.top +
    middleJoystickBoundingBox.height / 2 -
    middleJoystickSymbolBoundingBox.height / 2;
  middleJoystickSymbolTop -=
    (middleJoystickYPercent *
      (middleJoystickBoundingBox.height -
        middleJoystickSymbolBoundingBox.height)) /
    2;

  let middleJoystickSymbolLeft =
    middleJoystickBoundingBox.left +
    middleJoystickBoundingBox.width / 2 -
    middleJoystickSymbolBoundingBox.width / 2;
  // middleJoystickSymbolLeft += middleJoystickXPercent * (middleJoystickBoundingBox.width -  middleJoystickSymbolBoundingBox.width) / 2

  $("#middleJoystickSymbol").css({
    top: middleJoystickSymbolTop,
    left: middleJoystickSymbolLeft,
    position: "absolute"
  });

  let middle2JoystickSymbolTop =
    middle2JoystickBoundingBox.top +
    middle2JoystickBoundingBox.height / 2 -
    middle2JoystickSymbolBoundingBox.height / 2;
  // middle2JoystickSymbolTop -= middle2JoystickYPercent * (middle2JoystickBoundingBox.height -  middle2JoystickSymbolBoundingBox.height) / 2

  let middle2JoystickSymbolLeft =
    middle2JoystickBoundingBox.left +
    middle2JoystickBoundingBox.width / 2 -
    middle2JoystickSymbolBoundingBox.width / 2;
  middle2JoystickSymbolLeft +=
    (middle2JoystickXPercent *
      (middle2JoystickBoundingBox.width -
        middle2JoystickSymbolBoundingBox.width)) /
    2;

  $("#middle2JoystickSymbol").css({
    top: middle2JoystickSymbolTop,
    left: middle2JoystickSymbolLeft,
    position: "absolute"
  });
}

export function controlsOnWindowResize() {
  leftJoystick = document.getElementById("leftJoystick");
  leftJoystickBoundingBox = leftJoystick.getBoundingClientRect();
  leftJoystickSymbol = document.getElementById("leftJoystickSymbol");
  leftJoystickSymbolBoundingBox = leftJoystickSymbol.getBoundingClientRect();
  leftJoystickXPercent = 0;
  leftJoystickYPercent = 0;

  rightJoystick = document.getElementById("rightJoystick");
  rightJoystickBoundingBox = rightJoystick.getBoundingClientRect();
  rightJoystickSymbol = document.getElementById("rightJoystickSymbol");
  rightJoystickSymbolBoundingBox = rightJoystickSymbol.getBoundingClientRect();
  rightJoystickXPercent = 0;
  rightJoystickYPercent = 0;

  middleJoystick = document.getElementById("middleJoystick");
  middleJoystickBoundingBox = middleJoystick.getBoundingClientRect();
  middleJoystickSymbol = document.getElementById("middleJoystickSymbol");
  middleJoystickSymbolBoundingBox = middleJoystickSymbol.getBoundingClientRect();
  middleJoystickXPercent = 0;
  middleJoystickYPercent = 0;

  middle2Joystick = document.getElementById("middle2Joystick");
  middle2JoystickBoundingBox = middle2Joystick.getBoundingClientRect();
  middle2JoystickSymbol = document.getElementById(
    "middle2JoystickSymbol"
  );
  middle2JoystickSymbolBoundingBox = middle2JoystickSymbol.getBoundingClientRect();
  middle2JoystickXPercent = 0;
  middle2JoystickYPercent = 0;

  updateJoystickSymbols();
}

export function initControls() {
  console.log("Init Controls");
  leftJoystick = document.getElementById("leftJoystick");
  leftJoystickBoundingBox = leftJoystick.getBoundingClientRect();
  console.log("leftJoystickBoundingBox", leftJoystickBoundingBox);
  leftJoystickSymbol = document.getElementById("leftJoystickSymbol");
  leftJoystickSymbolBoundingBox = leftJoystickSymbol.getBoundingClientRect();
  leftJoystickXPercent = 0;
  leftJoystickYPercent = 0;

  rightJoystick = document.getElementById("rightJoystick");
  rightJoystickBoundingBox = rightJoystick.getBoundingClientRect();
  rightJoystickSymbol = document.getElementById("rightJoystickSymbol");
  rightJoystickSymbolBoundingBox = rightJoystickSymbol.getBoundingClientRect();
  rightJoystickXPercent = 0;
  rightJoystickYPercent = 0;

  middleJoystick = document.getElementById("middleJoystick");
  middleJoystickBoundingBox = middleJoystick.getBoundingClientRect();
  middleJoystickSymbol = document.getElementById("middleJoystickSymbol");
  middleJoystickSymbolBoundingBox = middleJoystickSymbol.getBoundingClientRect();
  middleJoystickXPercent = 0;
  middleJoystickYPercent = 0;

  middle2Joystick = document.getElementById("middle2Joystick");
  middle2JoystickBoundingBox = middle2Joystick.getBoundingClientRect();
  middle2JoystickSymbol = document.getElementById(
    "middle2JoystickSymbol"
  );
  middle2JoystickSymbolBoundingBox = middle2JoystickSymbol.getBoundingClientRect();
  middle2JoystickXPercent = 0;
  middle2JoystickYPercent = 0;
  ////////////// LEFT JOYSTICK ///////////////
  let leftJoystickTouch = undefined;
  function leftJoystickTouchstart(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      leftJoystickTouch = event.targetTouches[0];
    } else {
      leftJoystickTouch = event;
    }
    // Place element where the finger is
    leftJoystickXPercent = Math.min(
      Math.max(
        (leftJoystickTouch.clientX -
          leftJoystickBoundingBox.left -
          leftJoystickBoundingBox.width / 2) /
          (leftJoystickBoundingBox.width / 2 -
            leftJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    leftJoystickYPercent = Math.min(
      Math.max(
        (leftJoystickBoundingBox.top +
          leftJoystickBoundingBox.height / 2 -
          leftJoystickTouch.clientY) /
          (leftJoystickBoundingBox.height / 2 -
            leftJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function leftJoystickTouchmove(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      leftJoystickTouch = event.targetTouches[0];
    } else {
      leftJoystickTouch = event;
    }
    // Place element where the finger is
    leftJoystickXPercent = Math.min(
      Math.max(
        (leftJoystickTouch.clientX -
          leftJoystickBoundingBox.left -
          leftJoystickBoundingBox.width / 2) /
          (leftJoystickBoundingBox.width / 2 -
            leftJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    leftJoystickYPercent = Math.min(
      Math.max(
        (leftJoystickBoundingBox.top +
          leftJoystickBoundingBox.height / 2 -
          leftJoystickTouch.clientY) /
          (leftJoystickBoundingBox.height / 2 -
            leftJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function leftJoystickTouchend(event) {
    event.preventDefault();
    event.stopPropagation();
    leftJoystickXPercent = 0;
    leftJoystickYPercent = 0;
    // update_sigmoids();
    updateJoystickSymbols();
  }

  // Events

  leftJoystick.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      leftJoystickTouchstart(event);
    },
    false
  );

  leftJoystick.addEventListener(
    "touchmove",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      leftJoystickTouchmove(event);
    },
    false
  );

  leftJoystick.addEventListener(
    "touchend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      leftJoystickTouchend(event);
    },
    false
  );

  leftJoystick.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    leftJoystickTouchstart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      leftJoystickTouchmove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      leftJoystickTouchend(event);
    };
  };

  /////////////////// RIGHT JOYSTICK ////////////////
  let rightJoystickTouch = undefined;
  function rightJoystickTouchstart(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      rightJoystickTouch = event.targetTouches[0];
    } else {
      rightJoystickTouch = event;
    }
    // Place element where the finger is
    rightJoystickXPercent = Math.min(
      Math.max(
        (rightJoystickTouch.clientX -
          rightJoystickBoundingBox.left -
          rightJoystickBoundingBox.width / 2) /
          (rightJoystickBoundingBox.width / 2 -
            rightJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    rightJoystickYPercent = Math.min(
      Math.max(
        (rightJoystickBoundingBox.top +
          rightJoystickBoundingBox.height / 2 -
          rightJoystickTouch.clientY) /
          (rightJoystickBoundingBox.height / 2 -
            rightJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function rightJoystickTouchmove(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      rightJoystickTouch = event.targetTouches[0];
    } else {
      rightJoystickTouch = event;
    }
    // Place element where the finger is
    rightJoystickXPercent = Math.min(
      Math.max(
        (rightJoystickTouch.clientX -
          rightJoystickBoundingBox.left -
          rightJoystickBoundingBox.width / 2) /
          (rightJoystickBoundingBox.width / 2 -
            rightJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    rightJoystickYPercent = Math.min(
      Math.max(
        (rightJoystickBoundingBox.top +
          rightJoystickBoundingBox.height / 2 -
          rightJoystickTouch.clientY) /
          (rightJoystickBoundingBox.height / 2 -
            rightJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function rightJoystickTouchend(event) {
    event.preventDefault();
    event.stopPropagation();
    rightJoystickXPercent = 0;
    rightJoystickYPercent = 0;
    // update_sigmoids();
    updateJoystickSymbols();
  }

  // Events
  rightJoystick.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      rightJoystickTouchstart(event);
    },
    false
  );

  rightJoystick.addEventListener(
    "touchmove",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      rightJoystickTouchmove(event);
    },
    false
  );

  rightJoystick.addEventListener(
    "touchend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      rightJoystickTouchend(event);
    },
    false
  );

  rightJoystick.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    rightJoystickTouchstart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      rightJoystickTouchmove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      rightJoystickTouchend(event);
    };
  };

  /////////////// MIDDLE JOYSTICK //////////////
  let middleJoystickTouch = undefined;
  function middleJoystickTouchstart(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      middleJoystickTouch = event.targetTouches[0];
    } else {
      middleJoystickTouch = event;
    }
    // Place element where the finger is
    middleJoystickXPercent = Math.min(
      Math.max(
        (middleJoystickTouch.clientX -
          middleJoystickBoundingBox.left -
          middleJoystickBoundingBox.width / 2) /
          (middleJoystickBoundingBox.width / 2 -
            middleJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    middleJoystickYPercent = Math.min(
      Math.max(
        (middleJoystickBoundingBox.top +
          middleJoystickBoundingBox.height / 2 -
          middleJoystickTouch.clientY) /
          (middleJoystickBoundingBox.height / 2 -
            middleJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function middleJoystickTouchmove(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      middleJoystickTouch = event.targetTouches[0];
    } else {
      middleJoystickTouch = event;
    }
    // Place element where the finger is
    middleJoystickXPercent = Math.min(
      Math.max(
        (middleJoystickTouch.clientX -
          middleJoystickBoundingBox.left -
          middleJoystickBoundingBox.width / 2) /
          (middleJoystickBoundingBox.width / 2 -
            middleJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    middleJoystickYPercent = Math.min(
      Math.max(
        (middleJoystickBoundingBox.top +
          middleJoystickBoundingBox.height / 2 -
          middleJoystickTouch.clientY) /
          (middleJoystickBoundingBox.height / 2 -
            middleJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function middleJoystickTouchend(event) {
    event.preventDefault();
    event.stopPropagation();
    middleJoystickXPercent = 0;
    middleJoystickYPercent = 0;
    // update_sigmoids();
    updateJoystickSymbols();
  }

  // Events
  middleJoystick.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middleJoystickTouchstart(event);
    },
    false
  );

  middleJoystick.addEventListener(
    "touchmove",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middleJoystickTouchmove(event);
    },
    false
  );

  middleJoystick.addEventListener(
    "touchend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middleJoystickTouchend(event);
    },
    false
  );

  middleJoystick.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    middleJoystickTouchstart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      middleJoystickTouchmove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      middleJoystickTouchend(event);
    };
  };

  //////// MIDDLE 2 //////////////////////
  /////////////// MIDDLE JOYSTICK //////////////
  let middle2JoystickTouch = undefined;
  function middle2JoystickTouchstart(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      middle2JoystickTouch = event.targetTouches[0];
    } else {
      middle2JoystickTouch = event;
    }
    // Place element where the finger is
    middle2JoystickXPercent = Math.min(
      Math.max(
        (middle2JoystickTouch.clientX -
          middle2JoystickBoundingBox.left -
          middle2JoystickBoundingBox.width / 2) /
          (middle2JoystickBoundingBox.width / 2 -
            middle2JoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    middle2JoystickYPercent = Math.min(
      Math.max(
        (middle2JoystickBoundingBox.top +
          middle2JoystickBoundingBox.height / 2 -
          middle2JoystickTouch.clientY) /
          (middle2JoystickBoundingBox.height / 2 -
            middle2JoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function middle2JoystickTouchmove(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      middle2JoystickTouch = event.targetTouches[0];
    } else {
      middle2JoystickTouch = event;
    }
    // Place element where the finger is
    middle2JoystickXPercent = Math.min(
      Math.max(
        (middle2JoystickTouch.clientX -
          middle2JoystickBoundingBox.left -
          middle2JoystickBoundingBox.width / 2) /
          (middle2JoystickBoundingBox.width / 2 -
            middle2JoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    middle2JoystickYPercent = Math.min(
      Math.max(
        (middle2JoystickBoundingBox.top +
          middle2JoystickBoundingBox.height / 2 -
          middle2JoystickTouch.clientY) /
          (middle2JoystickBoundingBox.height / 2 -
            middle2JoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function middle2JoystickTouchend(event) {
    event.preventDefault();
    event.stopPropagation();
    middle2JoystickXPercent = 0;
    middle2JoystickYPercent = 0;
    // update_sigmoids();
    updateJoystickSymbols();
  }

  // Events
  middle2Joystick.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middle2JoystickTouchstart(event);
    },
    false
  );

  middle2Joystick.addEventListener(
    "touchmove",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middle2JoystickTouchmove(event);
    },
    false
  );

  middle2Joystick.addEventListener(
    "touchend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middle2JoystickTouchend(event);
    },
    false
  );

  middle2Joystick.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    middle2JoystickTouchstart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      middle2JoystickTouchmove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      middle2JoystickTouchend(event);
    };
  };

  //////// Main Item ///////
  let middleItem = document.getElementById("middleItem");
  let middleItemBoundingBox = middleItem.getBoundingClientRect();
  let middleItemSymbol = document.getElementById("middleItemSymbol");
  let middleItemSymbolBoundingBox = middleItemSymbol.getBoundingClientRect();

  let middleItemSymbolLeft =
    middleItemBoundingBox.left +
    middleItemBoundingBox.width / 2 -
    middleItemSymbolBoundingBox.width / 2;
  let middleItemSymbolTop =
    middleItemBoundingBox.top +
    middleItemBoundingBox.height / 2 -
    middleItemSymbolBoundingBox.height / 2;
  // update_sigmoids();
  $("#middleItemSymbol").css({
    top: middleItemSymbolTop,
    left: middleItemSymbolLeft,
    position: "absolute",
    color: "white"
  });

  let middleItemTouchMoveXHR = undefined;

  function touchStart(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.targetTouches && event.targetTouches.length == 1) {
      middleItemTouch = event.targetTouches[0];
    } else {
      middleItemTouch = event;
    }

    // Place element where the finger is
    // $("#middleItemSymbol").css({'font-size': '33vw'});
    middleItemSymbol = document.getElementById("middleItemSymbol");
    middleItemSymbolBoundingBox = middleItemSymbol.getBoundingClientRect();
    middleItemSymbolLeft =
      middleItemTouch.clientX -
      middleItemSymbolBoundingBox.width / 2;
    middleItemSymbolTop =
      middleItemTouch.clientY -
      middleItemSymbolBoundingBox.height / 2;
    // update_sigmoids();
    $("#middleItemSymbol").css({
      top: middleItemSymbolTop,
      left: middleItemSymbolLeft,
      position: "absolute"
    });
    $("#ui").hide();
  }

  function touchMove(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.targetTouches && event.targetTouches.length == 1) {
      middleItemTouch = event.targetTouches[0];
    } else {
      middleItemTouch = event;
    }

    // pick();

    // Place element where the finger is
    // $("#middleItemSymbol").css({'font-size': '33vw'});
    middleItemSymbol = document.getElementById("middleItemSymbol");
    middleItemSymbolBoundingBox = middleItemSymbol.getBoundingClientRect();
    middleItemSymbolLeft =
      middleItemTouch.clientX -
      middleItemSymbolBoundingBox.width / 2;
    middleItemSymbolTop =
      middleItemTouch.clientY -
      middleItemSymbolBoundingBox.height / 2;
    // update_sigmoids();
    $("#middleItemSymbol").css({
      top: middleItemSymbolTop,
      left: middleItemSymbolLeft,
      position: "absolute"
    });
    $("#ui").hide();

    if (middleItemTouchMoveXHR == undefined){
      middleItemTouchMoveXHR = setTimeout(function(){
        if (middleItemTouch != undefined){
          if(middleItemTouch.clientX >= middleItemBoundingBox.left &&
             middleItemTouch.clientX <= (middleItemBoundingBox.left + middleItemBoundingBox.width) &&
             middleItemTouch.clientY >= middleItemBoundingBox.top &&
             middleItemTouch.clientY <= (middleItemBoundingBox.top + middleItemBoundingBox.height)
            ){
            console.log("remove temp block")
            $("#middleItemSymbol").css({color: "white"});
            removeTempBlock();
            
          }else{
            $("#middleItemSymbol").css({color: "red"});
            let data = selectedObject(middleItemTouch)
            drawTempBlock(data)
          }
        }
        middleItemTouchMoveXHR = undefined;
      }, 50)
    }
  }

  function touchEnd(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    console.log(event)
    // Note these are "changed"Touches
    if (event.changedTouches && event.changedTouches.length == 1) {
      middleItemTouch = event.changedTouches[0];
    } else {
      middleItemTouch = event;
    }
    // $("#middleItemSymbol").css({'font-size': 'xxx-large'});
    middleItemSymbol = document.getElementById("middleItemSymbol");
    middleItemSymbolBoundingBox = middleItemSymbol.getBoundingClientRect();
    middleItemSymbolLeft =
      middleItemBoundingBox.left +
      middleItemBoundingBox.width / 2 -
      middleItemSymbolBoundingBox.width / 2;
    middleItemSymbolTop =
      middleItemBoundingBox.top +
      middleItemBoundingBox.height / 2 -
      middleItemSymbolBoundingBox.height / 2;
    // update_sigmoids();
    

    if (middleItemTouch != undefined) {
      if (
        middleItemTouch.clientX >= middleItemBoundingBox.left &&
        middleItemTouch.clientX <=
          middleItemBoundingBox.left +
            middleItemBoundingBox.width &&
        middleItemTouch.clientY >= middleItemBoundingBox.top &&
        middleItemTouch.clientY <=
          middleItemBoundingBox.top + middleItemBoundingBox.height
      ) {
        console.log("remove temp block");
        $("#middleItemSymbol").css({ color: "white" });
        removeTempBlock();

      } else {
        console.log("add or destroy block");
        removeTempBlock();
        let data = selectedObject(middleItemTouch)

        if (toggleMouseState == "destroy"){
          console.log("destroy")
          onMouseDownDestoryBlock(data);
    
        }else if (toggleMouseState == "create"){
          console.log("create")
          onMouseDownCreateBlock(data);
    
        }
      }
      middleItemTouch = undefined;
    }
    $("#middleItemSymbol").css({
      top: middleItemSymbolTop,
      left: middleItemSymbolLeft,
      position: "absolute",
      color: "white"
    });
    $("#ui").show();
  }

  function documenBodyTouchmove(event){
    event.preventDefault();
    event.stopPropagation();
    touchMove(event);
  }

  function documenBodyTouchend(event){
    event.preventDefault();
    event.stopPropagation();
    document.body.removeEventListener("touchmove", documenBodyTouchmove)
    document.body.removeEventListener("touchend", documenBodyTouchend)
    touchEnd(event);
  }

  middleItem.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      touchStart(event);
    
      document.body.addEventListener(
        "touchmove",
        documenBodyTouchmove,
        false
      );

      document.body.addEventListener(
        "touchend",
        documenBodyTouchend,
        false
      );
    },
    false
  )

  middleItem.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    touchStart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      touchMove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      touchEnd(event);
    };
  };

  updateJoystickSymbols();
}

export let rotationDegrees = undefined;
export let frontToBack_degrees = undefined;
export let leftToRight_degrees = undefined;


export function getOrientation(){
  console.log("Trying to get motion");
  isOrientationActive = true;
  if ( typeof( DeviceOrientationEvent ) !== "undefined" && typeof( DeviceOrientationEvent.requestPermission ) === "function" ){
    DeviceOrientationEvent.requestPermission().then(response => {
      if (response == 'granted') {
     // Add a listener to get smartphone orientation 
         // in the alpha-beta-gamma axes (units in degrees)
          window.addEventListener('deviceorientation',(event) => {
              // Expose each orientation angle in a more readable way
              rotationDegrees = event.alpha;
              frontToBack_degrees = event.beta;
              leftToRight_degrees = event.gamma;
          });
      }
    }).catch(console.error)
  }else{
    console.log("motion with out perms.", e);
    console.log("This does not work for your device");
    // window.addEventListener('deviceorientation',(event) => {
    //   // Expose each orientation angle in a more readable way
    //   console.log(event.alpha, event.beta, event.gamma);
    //   rotationDegrees = event.gamma;
    //   leftToRight_degrees = event.beta;
    //   // leftToRight_degrees = event.gamma;
    // });
  }
  
}

const btn = document.getElementById( "toogleOrientation" );
btn.addEventListener( "touchstart", getOrientation );

// document.body.addEventListener(
//   "touchstart",
//   function(event){
//     if (isOrientationActive == false){
//       getOrientation();
//       isOrientationActive = true;
//     }
//   }
// )

initControls();
updateJoystickSymbols();