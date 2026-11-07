"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useProgress
} from "@react-three/drei";
import * as THREE from "three";
import { CarModel } from "@/components/3d/car-model";
import type { CarSpec } from "@/lib/configurator";

function SceneLoader() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 z-25 pointer-events-none select-none flex items-center justify-center bg-[#08090b]/60 backdrop-blur-sm">
      <span className="whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.28em] text-gold">
        Calibrating surface — {Math.round(progress)}%
      </span>
    </div>
  );
}

function StudioFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.13, 0]} receiveShadow>
        <circleGeometry args={[7.5, 96]} />
        <meshStandardMaterial color="#090a0c" metalness={0.58} roughness={0.42} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.122, 0]}>
        <ringGeometry args={[2.86, 2.878, 128]} />
        <meshBasicMaterial color="#e5a93c" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.122, 0]}>
        <ringGeometry args={[3.22, 3.228, 128]} />
        <meshBasicMaterial color="#e5a93c" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      <gridHelper args={[15, 30, "#1b201a", "#101311"]} position={[0, -0.125, 0]} />

      <ContactShadows
        position={[0, -0.118, 0]}
        opacity={0.72}
        scale={12}
        blur={2.7}
        far={5}
        resolution={512}
        color="#000000"
      />
    </>
  );
}

export function CarScene({ spec }: { spec: CarSpec }) {
  return (
    <div className="relative w-full h-full min-h-[450px]">
      <SceneLoader />

      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 6.2, -13.5], fov: 26, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          gl.setClearColor("#08090b", 0);
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.34} />
          <directionalLight
            position={[5, 8, 3]}
            intensity={2.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0002}
          />
          <directionalLight position={[-6, 4, -6]} intensity={1.5} color="#e5a93c" />
          <spotLight
            position={[0, 6.5, -4]}
            angle={0.52}
            penumbra={1}
            intensity={45}
            distance={22}
            color="#fff6e4"
          />
          <pointLight position={[0, 1.1, 3.6]} intensity={9} distance={9} color="#e5a93c" />

          <Environment resolution={256} frames={1}>
            <group rotation={[-Math.PI / 3, 0, 1]}>
              <Lightformer form="rect" intensity={3.4} position={[0, 6, -9]} scale={[12, 5, 1]} />
              <Lightformer
                form="rect"
                intensity={2.2}
                position={[-8, 3, 2]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[6, 3, 1]}
                color="#f2e4c8"
              />
              <Lightformer
                form="rect"
                intensity={1.8}
                position={[8, 4, 2]}
                rotation={[0, -Math.PI / 2, 0]}
                scale={[6, 3, 1]}
                color="#b9c0b4"
              />
              <Lightformer
                form="ring"
                intensity={1.6}
                position={[0, 2, 8]}
                scale={[4, 4, 1]}
                color="#e5a93c"
              />
            </group>
          </Environment>

          <CarModel spec={spec} />
          <StudioFloor />

          <OrbitControls
            makeDefault
            target={[0, 0.4, 0]}
            enablePan={false}
            enableZoom={true}
            minDistance={11}
            maxDistance={16}
            autoRotate
            autoRotateSpeed={0.52}
            minPolarAngle={0.6}
            maxPolarAngle={Math.PI / 2.1}
            rotateSpeed={0.55}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}