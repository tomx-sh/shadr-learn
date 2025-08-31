import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        rules: {
            "*.{glsl,vs,fs,vert,frag}": {
                loaders: [
                    { loader: "raw-loader", options: {} },
                    { loader: "glslify-loader", options: {} },
                ],
                as: "*.js",
            },
        }
    },
};

export default nextConfig;
