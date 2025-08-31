"use client"
import * as THREE from "three";
import { useMemo } from "react";
import initSdfGen from "webgl-sdf-generator";
import SVGPathCommander from "svg-path-commander";

export type Args = {
    pathD: string;
    viewBox: [number, number, number, number] | "auto";
    width: number;
    height: number;
    maxDistance?: number;
    exponent?: number;
};

const gen = initSdfGen();

export function useSdfTexture({
    pathD,
    viewBox: viewBoxProp,
    width,
    height,
    maxDistance = Math.max(8, Math.round(Math.min(width, height) * 0.03)),
    exponent = 1,
}: Args) {
    return useMemo(() => {
        const svg = new SVGPathCommander(pathD)
            .flipY()
            .normalize();

        const bbox = svg.bbox; // { x, y, width, height }
        const cleanPathD = svg.toString();

        // Resolve viewBox [l, t, r, b]
        let vb: [number, number, number, number];
        if (viewBoxProp === "auto") {
            vb = [bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height];
        } else {
            vb = viewBoxProp;
        }
        const [l, t, r, b] = vb;

        // Compute bbox center → uvCenter (map into resolved viewBox extents)
        const cx = bbox.x + bbox.width * 0.5;
        const cy = bbox.y + bbox.height * 0.5;
        const u = (cx - l) / (r - l);
        const v = (cy - t) / (b - t);
        const uvCenter = new THREE.Vector2(u, v);

        // Generate SDF bytes and build texture
        const data: Uint8Array = gen.generate(width, height, cleanPathD, vb, maxDistance, exponent);
        const texture = new THREE.DataTexture(
            data,
            width,
            height,
            THREE.RedFormat,
            THREE.UnsignedByteType
        );
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

        return { texture: texture, center: uvCenter };
    }, [pathD, viewBoxProp, width, height, maxDistance, exponent]);
}