export const Arm = ({
  side,
  armRef,
  forearmRef,
  handRef,
  fingersRef,
  position,
}) => {
  const isLeft = side === "left";

  return (
    <group ref={armRef} position={position}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#4A90E2" roughness={0.7} />
      </mesh>

      <group ref={forearmRef} position={[0, -0.25, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.06, 0.2, 0.06]} />
          <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
        </mesh>

        <group ref={handRef} position={[0, -0.2, 0]}>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.08, 0.12, 0.03]} />
            <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
          </mesh>

          <group position={[0, -0.12, 0]}>
            {/* Thumb */}
            <mesh
              ref={(el) => (fingersRef.current[0] = el)}
              position={[isLeft ? 0.05 : -0.05, 0.02, 0.02]}
              rotation={[0, 0, isLeft ? -0.5 : 0.5]}
            >
              <boxGeometry args={[0.015, 0.05, 0.015]} />
              <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
            </mesh>

            {/* Index */}
            <mesh
              ref={(el) => (fingersRef.current[1] = el)}
              position={[isLeft ? 0.025 : -0.025, -0.03, 0]}
            >
              <boxGeometry args={[0.015, 0.06, 0.015]} />
              <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
            </mesh>

            {/* Middle */}
            <mesh
              ref={(el) => (fingersRef.current[2] = el)}
              position={[0, -0.035, 0]}
            >
              <boxGeometry args={[0.015, 0.07, 0.015]} />
              <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
            </mesh>

            {/* Ring */}
            <mesh
              ref={(el) => (fingersRef.current[3] = el)}
              position={[isLeft ? -0.025 : 0.025, -0.03, 0]}
            >
              <boxGeometry args={[0.015, 0.06, 0.015]} />
              <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
            </mesh>

            {/* Pinky */}
            <mesh
              ref={(el) => (fingersRef.current[4] = el)}
              position={[isLeft ? -0.04 : 0.04, -0.025, 0]}
            >
              <boxGeometry args={[0.015, 0.05, 0.015]} />
              <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
