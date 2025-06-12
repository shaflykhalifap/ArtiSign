export const Head = () => {
  return (
    <>
      {/* Head */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 0.65, 0.18]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.08, 0.65, 0.18]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Pupil of the eyes */}
      <mesh position={[-0.08, 0.65, 0.19]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      <mesh position={[0.08, 0.65, 0.19]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>

      {/* Eyebrow */}
      <mesh position={[-0.08, 0.7, 0.18]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.04, 0.01, 0.005]} />
        <meshStandardMaterial color="#2D1B0E" />
      </mesh>
      <mesh position={[0.08, 0.7, 0.18]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.04, 0.01, 0.005]} />
        <meshStandardMaterial color="#2D1B0E" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.58, 0.19]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} />
      </mesh>

      {/* Mount */}
      <mesh position={[0, 0.52, 0.18]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="#C47063" />
      </mesh>
    </>
  );
};
