"use client";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { LiquidGlassShader } from "./liquid-glass-shader";

export default function ThreeCanvas() {
    return (
        <Canvas
            style={{ width: 512, height: 512, background: "black" }}
            gl={{ antialias: true }}
            dpr={2}
        >
            <OrthographicCamera
                makeDefault
                left={-1}
                right={1}
                top={1}
                bottom={-1}
                near={0.1}
                far={10}
                position={[0, 0, 1]}
            />
            <mesh>
                <planeGeometry args={[2, 2]} />
                <LiquidGlassShader />
            </mesh>
        </Canvas>
    );
}

