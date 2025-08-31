"use client"
import { useTexture } from "@react-three/drei"
import vertexShader from "@/shaders/vertex.glsl";
import fragmentShader from "@/shaders/fragment.glsl";
import { useSdfTexture } from "./use-sdf-texture";
import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useSlidersValues } from "./sliders";


export function LiquidGlassShader() {
    const bgTex = useTexture("/forest.jpg");

    const { maxDistance, exponent, curve, zoom } = useSlidersValues();

    const {
        texture: sdfTex,
        center: center
    } = useSdfTexture({
        pathD: "M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z",
        viewBox: [-50, -50, 50, 50],
        //viewBox: 'auto',
        width: 512,
        height: 512,
        maxDistance: maxDistance,
        exponent: exponent
    })

    useEffect(() => {
        return () => {
            sdfTex.dispose();
        }
    }, [sdfTex]);

    // const sdfTex2 = useSdfTexture({
    //     pathD: 'M0,0L50,25L25,50Z',
    //     viewBox: [-5, -5, 55, 55],
    //     width: 64,
    //     height: 64,
    //     maxDistance: 1,
    // })

    const sdfSize = useMemo(() => new THREE.Vector2(512, 512), []);
    const uniforms = useMemo(() => ({
        uBgTex: { value: bgTex },
        uSDFTex: { value: sdfTex },
        uSdfTexSize: { value: sdfSize },
        uCurve: { value: curve },
        uZoom: { value: zoom },
        uCenter: { value: center },
    }), []);

    return (
        <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            uniforms-uBgTex-value={bgTex}
            uniforms-uSDFTex-value={sdfTex}
            uniforms-uSdfTexSize-value={sdfSize}
            uniforms-uCurve-value={curve}
            uniforms-uZoom-value={zoom}
            uniforms-uCenter-value={center}
            transparent={true}
            depthTest={false}
        />
    )
}