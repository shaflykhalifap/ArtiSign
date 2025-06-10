import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Head } from "./Head";
import { Hair } from "./Hair";
import { Body } from "./Body";
import { Arm } from "./Arm";
import { Legs } from "./Legs";

export const Character = ({ currentGesture }) => {
  const group = useRef();
  const rightArm = useRef();
  const rightForearm = useRef();
  const rightHand = useRef();
  const rightFingers = useRef([]);

  const leftArm = useRef();
  const leftForearm = useRef();
  const leftHand = useRef();
  const leftFingers = useRef([]);

  useFrame(() => {
    if (!currentGesture) return;

    // Right Hand Animation
    if (
      currentGesture.rightHand &&
      rightArm.current &&
      rightForearm.current &&
      rightHand.current
    ) {
      const { rotation, fingerConfig } = currentGesture.rightHand;

      rightArm.current.rotation.x = THREE.MathUtils.lerp(
        rightArm.current.rotation.x,
        rotation[0] * 0.4,
        0.06
      );
      rightArm.current.rotation.y = THREE.MathUtils.lerp(
        rightArm.current.rotation.y,
        rotation[1] * 0.3,
        0.06
      );
      rightArm.current.rotation.z = THREE.MathUtils.lerp(
        rightArm.current.rotation.z,
        rotation[2] * 0.6,
        0.06
      );

      rightForearm.current.rotation.x = THREE.MathUtils.lerp(
        rightForearm.current.rotation.x,
        rotation[0] * 0.5,
        0.06
      );
      rightForearm.current.rotation.y = THREE.MathUtils.lerp(
        rightForearm.current.rotation.y,
        rotation[1] * 0.7,
        0.06
      );

      rightHand.current.rotation.x = THREE.MathUtils.lerp(
        rightHand.current.rotation.x,
        rotation[0] * 0.4,
        0.06
      );
      rightHand.current.rotation.y = THREE.MathUtils.lerp(
        rightHand.current.rotation.y,
        rotation[1] * 0.5,
        0.06
      );
      rightHand.current.rotation.z = THREE.MathUtils.lerp(
        rightHand.current.rotation.z,
        rotation[2] * 0.3,
        0.06
      );

      // Right Hand Fingers Animation
      if (
        rightFingers.current &&
        rightFingers.current.length > 0 &&
        fingerConfig
      ) {
        const fingerNames = ["thumb", "index", "middle", "ring", "pinky"];
        rightFingers.current.forEach((finger, index) => {
          if (finger && fingerConfig[fingerNames[index]]) {
            const config = fingerConfig[fingerNames[index]];
            finger.rotation.x = THREE.MathUtils.lerp(
              finger.rotation.x,
              config.rotation[0],
              0.05
            );
            finger.rotation.y = THREE.MathUtils.lerp(
              finger.rotation.y,
              config.rotation[1],
              0.05
            );
            finger.rotation.z = THREE.MathUtils.lerp(
              finger.rotation.z,
              config.rotation[2],
              0.05
            );
            finger.visible = config.visible;
          }
        });
      }
    }

    // Left Hand Animation
    if (
      currentGesture.leftHand &&
      leftArm.current &&
      leftForearm.current &&
      leftHand.current
    ) {
      const { rotation, fingerConfig } = currentGesture.leftHand;

      leftArm.current.rotation.x = THREE.MathUtils.lerp(
        leftArm.current.rotation.x,
        rotation[0] * 0.4,
        0.06
      );
      leftArm.current.rotation.y = THREE.MathUtils.lerp(
        leftArm.current.rotation.y,
        rotation[1] * 0.3,
        0.06
      );
      leftArm.current.rotation.z = THREE.MathUtils.lerp(
        leftArm.current.rotation.z,
        rotation[2] * 0.6,
        0.06
      );

      leftForearm.current.rotation.x = THREE.MathUtils.lerp(
        leftForearm.current.rotation.x,
        rotation[0] * 0.5,
        0.06
      );
      leftForearm.current.rotation.y = THREE.MathUtils.lerp(
        leftForearm.current.rotation.y,
        rotation[1] * 0.7,
        0.06
      );

      leftHand.current.rotation.x = THREE.MathUtils.lerp(
        leftHand.current.rotation.x,
        rotation[0] * 0.4,
        0.06
      );
      leftHand.current.rotation.y = THREE.MathUtils.lerp(
        leftHand.current.rotation.y,
        rotation[1] * 0.5,
        0.06
      );
      leftHand.current.rotation.z = THREE.MathUtils.lerp(
        leftHand.current.rotation.z,
        rotation[2] * 0.3,
        0.06
      );

      // Left Hand Fingers Animation
      if (
        leftFingers.current &&
        leftFingers.current.length > 0 &&
        fingerConfig
      ) {
        const fingerNames = ["thumb", "index", "middle", "ring", "pinky"];
        leftFingers.current.forEach((finger, index) => {
          if (finger && fingerConfig[fingerNames[index]]) {
            const config = fingerConfig[fingerNames[index]];
            finger.rotation.x = THREE.MathUtils.lerp(
              finger.rotation.x,
              config.rotation[0],
              0.05
            );
            finger.rotation.y = THREE.MathUtils.lerp(
              finger.rotation.y,
              config.rotation[1],
              0.05
            );
            finger.rotation.z = THREE.MathUtils.lerp(
              finger.rotation.z,
              config.rotation[2],
              0.05
            );
            finger.visible = config.visible;
          }
        });
      }
    } else if (leftArm.current) {
      // Reset Positions if no left hand gesture
      leftArm.current.rotation.x = THREE.MathUtils.lerp(
        leftArm.current.rotation.x,
        0,
        0.06
      );
      leftArm.current.rotation.y = THREE.MathUtils.lerp(
        leftArm.current.rotation.y,
        0,
        0.06
      );
      leftArm.current.rotation.z = THREE.MathUtils.lerp(
        leftArm.current.rotation.z,
        0,
        0.06
      );
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]} scale={1.5}>
      <Head />
      <Hair />
      <Body />

      <Arm
        side="left"
        armRef={leftArm}
        forearmRef={leftForearm}
        handRef={leftHand}
        fingersRef={leftFingers}
        position={[-0.25, 0.3, 0]}
      />

      <Arm
        side="right"
        armRef={rightArm}
        forearmRef={rightForearm}
        handRef={rightHand}
        fingersRef={rightFingers}
        position={[0.25, 0.3, 0]}
      />

      <Legs />
    </group>
  );
};
