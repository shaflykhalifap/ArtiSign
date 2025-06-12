export const Body = () => {
  return (
    <>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
        <meshStandardMaterial color="#FDBCB4" roughness={0.6} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.2]} />
        <meshStandardMaterial color="#4A90E2" roughness={0.7} metalness={0.1} />
      </mesh>
    </>
  );
};
