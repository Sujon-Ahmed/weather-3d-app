import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Sky,
  Stars,
  Points,
  PointMaterial,
} from "@react-three/drei";
import { useRef } from "react";

/* 🌧️ Rain */
function Rain({ isDay }: { isDay?: boolean }) {
  const ref = useRef<any>(null);
  const count = 3000;

  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame(() => {
    const pos = ref.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= 0.2;
      if (pos[i * 3 + 1] < -5) pos[i * 3 + 1] = 10;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={isDay ? "#a0c4ff" : "#6aa9ff"}
        size={0.05}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

/* ☀️ Sun */
const Sun = () => {
  const ref = useRef<any>(null);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={ref} position={[0, 3, -2]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial emissive="#FDB813" color="#FDB813" />
    </mesh>
  );
};

/* ☁️ Cloud */
const Cloud = () => (
  <mesh position={[0, 3, 0]}>
    <sphereGeometry args={[2, 32, 32]} />
    <meshStandardMaterial color="#ccc" />
  </mesh>
);

function WeatherObject({ type, isDay }: { type?: string; isDay?: boolean }) {
  if (type === "Rain") return <Rain isDay={isDay} />;
  if (type === "Clouds") return <Cloud />;
  return isDay ? <Sun /> : null;
}

const Scene = ({
  weatherType,
  isDay,
}: {
  weatherType?: string;
  isDay?: boolean;
}) => {
  return (
    <Canvas className="absolute inset-0">
      {/* Lighting */}
      <ambientLight intensity={isDay ? 0.6 : 0.2} />
      <pointLight position={[10, 10, 10]} intensity={isDay ? 1.5 : 0.5} />

      {/* Sky */}
      <Sky sunPosition={isDay ? [100, 20, 100] : [0, -10, 0]} />

      {/* 🌙 Night Stars */}
      {!isDay && <Stars count={5000} />}

      {/* 🌫️ Fog (Dhaka vibe) */}
      <fog attach="fog" args={[isDay ? "#aaa" : "#111", 5, 25]} />

      {/* 🌦️ Weather */}
      <WeatherObject type={weatherType} isDay={isDay} />

      {/* Camera */}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
    </Canvas>
  );
};

export default Scene;
