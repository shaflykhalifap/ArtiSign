export const Hair = () => {
  return (
    <>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.18, 32, 16]} />
        <meshStandardMaterial color="#2D1B0E" roughness={0.8} metalness={0.0} />
      </mesh>
    </>
  );
};
