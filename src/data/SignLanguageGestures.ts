const signLanguageGestures = {
  A: {
    rightHand: {
      rotation: [-2.5, -1.5, 0.2],
      position: [5, 1.7, 0],
      fingerConfig: {
        thumb: { rotation: [5, 2, 1], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: false },
        ring: { rotation: [-1.5, 0, 0], visible: false },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
    leftHand: {
      rotation: [-2.5, 1.5, 0.2],
      position: [-5, 1.7, 0],
      fingerConfig: {
        thumb: { rotation: [5, 2, 1], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: false },
        ring: { rotation: [-1.5, 0, 0], visible: false },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
  },
  B: {
    rightHand: {
      rotation: [-2.3, 0, -0.8],
      position: [-2, 1, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.3, 1.1, 0.5],
      position: [-2, 1, 1],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0], visible: false },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [0, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
  },
  C: {
    rightHand: {
      rotation: [0, 0, 0],
      position: [0, 0, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0.8], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [0, 0, 0], visible: false },
        pinky: { rotation: [0, 0, 0], visible: false },
      },
    },
    leftHand: {
      rotation: [-2.3, 1.1, 0.5],
      position: [-2, 1, 1],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0.8], visible: true },
        index: { rotation: [-0.8, 0, 0], visible: true },
        middle: { rotation: [-0.8, 0, 0], visible: true },
        ring: { rotation: [-0.8, 0, 0], visible: true },
        pinky: { rotation: [-0.8, 0, 0], visible: true },
      },
    },
  },
  D: {
    rightHand: {
      rotation: [-2.3, 0, -0.8],
      position: [-2, 1, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.3, 1.1, 0.5],
      position: [-2, 1, 1],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0.8], visible: true },
        index: { rotation: [-0.8, 0, 0], visible: true },
        middle: { rotation: [-0.8, 0, 0], visible: true },
        ring: { rotation: [-0.8, 0, 0], visible: true },
        pinky: { rotation: [-0.8, 0, 0], visible: true },
      },
    },
  },
  E: {
    rightHand: {
      rotation: [0, 0, 0],
      position: [0, 0, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0.8], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [0, 0, 0], visible: false },
        pinky: { rotation: [0, 0, 0], visible: false },
      },
    },
    leftHand: {
      rotation: [-2.3, 1.1, 0.5],
      position: [-2, 1, 1],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0], visible: false },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [0, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
  },
  F: {
    rightHand: {
      rotation: [-2.3, 0, -0.8],
      position: [-2, 1, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.3, 1.1, 0.5],
      position: [-2, 1, 1],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: false },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: false },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
  },
  G: {
    rightHand: {
      rotation: [-2.5, -1.8, 0],
      position: [1, 2, 0],
      fingerConfig: {
        thumb: { rotation: [-1.2, 0, 0.5], visible: true },
        index: { rotation: [-1.5, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.5, 1.8, 0],
      position: [-1, 2, 0],
      fingerConfig: {
        thumb: { rotation: [-1.2, 0, -0.5], visible: true },
        index: { rotation: [-1.5, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  H: {
    rightHand: {
      rotation: [-2.3, 0, -0.8],
      position: [-2, 1, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.3, 1.1, 0.5],
      position: [-2, 1, 1],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  I: {
    rightHand: {
      rotation: [0, 0, 0],
      position: [0, 0, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0.8], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [0, 0, 0], visible: false },
        pinky: { rotation: [0, 0, 0], visible: false },
      },
    },
    leftHand: {
      rotation: [-2.5, 0, 1],
      position: [1, 1.8, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: false },
        index: { rotation: [-1.5, 0, 0], visible: false },
        middle: { rotation: [-1.5, 0, 0], visible: false },
        ring: { rotation: [-1.5, 0, 0], visible: false },
        pinky: { rotation: [0, 0, 0], visible: true },
      },
    },
  },
  J: {
    rightHand: {
      rotation: [-1.8, 0, -1.0],
      position: [1.5, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [-1.5, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [0, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-1.8, -1, 1],
      position: [1.5, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [-1.5, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [0, 0, 0], visible: true },
      },
    },
  },
  K: {
    rightHand: {
      rotation: [-2.5, 0, -0.3],
      position: [1, 2, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0.5], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.5, 1, 1.5],
      position: [-1, 0, 1],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, -0.5], visible: true },
        index: { rotation: [-0.8, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  L: {
    leftHand: {
      rotation: [-2.5, 0, 0],
      position: [-1, 2, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, -1.5], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  M: {
    rightHand: {
      rotation: [-2.5, -0.8, -0.5],
      position: [0.5, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-0.8, 0, 0], visible: true },
        index: { rotation: [-1.2, 0, 0], visible: true },
        middle: { rotation: [-1.2, 0, 0], visible: true },
        ring: { rotation: [-1.2, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.5, 0.8, 0.5],
      position: [-0.5, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [0, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  N: {
    rightHand: {
      rotation: [-2.5, -0.8, -0.5],
      position: [0.5, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-0.8, 0, 0], visible: true },
        index: { rotation: [-1.2, 0, 0], visible: true },
        middle: { rotation: [-1.2, 0, 0], visible: true },
        ring: { rotation: [-1.2, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.5, 0.8, 0.5],
      position: [-0.5, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  O: {
    leftHand: {
      rotation: [-2.5, 0, 0],
      position: [0, 1.8, 0],
      fingerConfig: {
        thumb: { rotation: [-0.8, 0, 0.8], visible: true },
        index: { rotation: [-0.8, 0, 0.5], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  P: {
    rightHand: {
      rotation: [-2.5, 0, -0.8],
      position: [-2, 1, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.5, 1.5, 0.5],
      position: [-1, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-0.8, 0, 0.8], visible: true },
        index: { rotation: [-0.8, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: false },
        ring: { rotation: [-1.5, 0, 0], visible: false },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
  },
  Q: {
    rightHand: {
      rotation: [-2.5, 0, -0.8],
      position: [0.5, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-0.8, 0, 0.8], visible: true },
        index: { rotation: [-0.8, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.5, 1.5, 0.5],
      position: [-0.3, 1.5, 0.2],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  R: {
    leftHand: {
      rotation: [-2.5, 0, 0],
      position: [0, 2, 0],
      fingerConfig: {
        thumb: { rotation: [-0.5, 0, 0.8], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-0.8, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  S: {
    rightHand: {
      rotation: [-2.8, -1.1, -0.5],
      position: [2, 1, 1],
      fingerConfig: {
        thumb: { rotation: [0, 0, -0.8], visible: true },
        index: { rotation: [-0.8, 0, 0], visible: true },
        middle: { rotation: [-0.8, 0, 0], visible: true },
        ring: { rotation: [-0.8, 0, 0], visible: true },
        pinky: { rotation: [-0.8, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.3, 1.1, 0.5],
      position: [-2, 1, 1],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0.8], visible: true },
        index: { rotation: [-0.8, 0, 0], visible: true },
        middle: { rotation: [-0.8, 0, 0], visible: true },
        ring: { rotation: [-0.8, 0, 0], visible: true },
        pinky: { rotation: [-0.8, 0, 0], visible: true },
      },
    },
  },
  T: {
    rightHand: {
      rotation: [-2.5, 0, -1],
      position: [0, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: false },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: false },
        ring: { rotation: [-1.5, 0, 0], visible: false },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
    leftHand: {
      rotation: [-3.5, 2, 1],
      position: [-0.8, 1.5, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: false },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: false },
        ring: { rotation: [-1.5, 0, 0], visible: false },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
  },
  U: {
    leftHand: {
      rotation: [-2.5, 0, 0],
      position: [0, 2, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: true },
        index: { rotation: [0, 0, 0.5], visible: true },
        middle: { rotation: [0, 0, -0.5], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  V: {
    rightHand: {
      rotation: [-2.5, 0, 0],
      position: [1, 2, 0],
      fingerConfig: {
        thumb: { rotation: [-1.5, 0, 0], visible: false },
        index: { rotation: [0, 0, -0.5], visible: true },
        middle: { rotation: [0, 0, 0.5], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: false },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
  },
  W: {
    rightHand: {
      rotation: [-2.5, 0, -0.5],
      position: [1, 2, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, 1.5], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
    leftHand: {
      rotation: [-2.5, 0, 0.5],
      position: [-1, 2, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, -1.5], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [-1.5, 0, 0], visible: true },
      },
    },
  },
  X: {
    rightHand: {
      rotation: [-2.8, -1.7, 0],
      position: [2, 1, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0], visible: false },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: false },
        ring: { rotation: [0, 0, 0], visible: false },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
    leftHand: {
      rotation: [-2.8, 1.7, 0],
      position: [-2, 1, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0], visible: false },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: false },
        ring: { rotation: [0, 0, 0], visible: false },
        pinky: { rotation: [-1.5, 0, 0], visible: false },
      },
    },
  },
  Y: {
    rightHand: {
      rotation: [-2.5, 0, 0],
      position: [1, 1.8, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, 1.5], visible: true },
        index: { rotation: [-1.5, 0, 0], visible: true },
        middle: { rotation: [-1.5, 0, 0], visible: true },
        ring: { rotation: [-1.5, 0, 0], visible: true },
        pinky: { rotation: [0, 0, 0], visible: true },
      },
    },
  },
  Z: {
    leftHand: {
      rotation: [-2.5, 0, -1],
      position: [0, 1.8, 0],
      fingerConfig: {
        thumb: { rotation: [-1, -1, -1], visible: true },
        index: { rotation: [-1, -1, -1], visible: true },
        middle: { rotation: [-1, -1, -1], visible: true },
        ring: { rotation: [-1, -1, -1], visible: true },
        pinky: { rotation: [-1, -1, -1], visible: true },
      },
    },
  },

  DEFAULT: {
    rightHand: {
      rotation: [0, 0, -0.5],
      position: [0.45, -0.2, 0],
      fingerConfig: {
        thumb: { rotation: [0, 0, 0], visible: true },
        index: { rotation: [0, 0, 0], visible: true },
        middle: { rotation: [0, 0, 0], visible: true },
        ring: { rotation: [0, 0, 0], visible: true },
        pinky: { rotation: [0, 0, 0], visible: true },
      },
    },
  },
};

export default signLanguageGestures;
