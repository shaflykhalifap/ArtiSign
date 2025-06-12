export const Legs = () => {
  return (
    <group position={[0, -0.3, 0]}>
      <mesh position={[-0.08, -0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#2C3E50" roughness={0.7} />
      </mesh>
      <mesh position={[0.08, -0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#2C3E50" roughness={0.7} />
      </mesh>
      <mesh position={[-0.08, -0.42, 0.02]}>
        <boxGeometry args={[0.1, 0.04, 0.12]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0.08, -0.42, 0.02]}>
        <boxGeometry args={[0.1, 0.04, 0.12]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
};
