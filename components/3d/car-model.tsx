"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  COATINGS,
  PAINTS,
  TINTS,
  type CarSpec
} from "@/lib/configurator";

useGLTF.setDecoderPath("/draco/");

export function CarModel({ spec }: { spec: CarSpec }) {
  const { scene } = useGLTF("/models/ferrari.glb");
  const clone = useMemo(() => scene.clone(true), [scene]);
  const group = useRef<THREE.Group>(null);

  const paint = PAINTS.find((entry) => entry.id === spec.paint) ?? PAINTS[0];
  const coating = COATINGS.find((entry) => entry.id === spec.coating) ?? COATINGS[0];
  const tint = TINTS.find((entry) => entry.id === spec.tint) ?? TINTS[1];
  const filmBoost = spec.ppf === "full" ? 0.045 : spec.ppf === "track" ? 0.022 : 0;

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(paint.hex),
        metalness: paint.metalness,
        roughness: coating.roughness,
        clearcoat: Math.min(1, coating.clearcoat + filmBoost),
        clearcoatRoughness: Math.max(0.02, coating.clearcoatRoughness - filmBoost / 2),
        envMapIntensity: 1.55,
        sheen: 0.35,
        sheenColor: new THREE.Color("#e5a93c"),
        sheenRoughness: 0.55
      }),
    [
      paint.hex,
      paint.metalness,
      coating.roughness,
      coating.clearcoat,
      coating.clearcoatRoughness,
      filmBoost
    ]
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#07090b"),
        metalness: 0.25,
        roughness: 0.06,
        transmission: 0.08,
        transparent: true,
        opacity: tint.opacity,
        envMapIntensity: 1.8,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    [tint.opacity]
  );

  const wheelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#121417"),
        metalness: 0.92,
        roughness: 0.24
      }),
    []
  );

  useEffect(() => {
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const source = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const materialName = source?.name ?? "";
      const nodeName = `${mesh.name} ${mesh.parent?.name ?? ""}`.toLowerCase();

      if (materialName === "Body_Color" || nodeName.includes("body")) {
        mesh.material = bodyMaterial;
      } else if (materialName === "Glass_Gray" || nodeName.includes("glass")) {
        mesh.material = glassMaterial;
      } else if (
        materialName === "Tires" ||
        materialName === "metal_gray" ||
        nodeName.includes("rim_") ||
        nodeName.includes("wheel")
      ) {
        mesh.material = wheelMaterial;
      }
    });
  }, [clone, bodyMaterial, glassMaterial, wheelMaterial]);

  useEffect(() => {
    return () => {
      bodyMaterial.dispose();
      glassMaterial.dispose();
      wheelMaterial.dispose();
    };
  }, [bodyMaterial, glassMaterial, wheelMaterial]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = -0.12 + Math.sin(t * 0.6) * 0.004;
  });

  return (
    <group ref={group} position={[0, -0.12, 0]}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload("/models/ferrari.glb");
