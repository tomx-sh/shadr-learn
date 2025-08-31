import ThreeCanvas from "@/components/three-canvas";
import { Sliders } from "@/components/sliders";
import { SldrsCtxProvider } from "@/components/sliders";

export default function Home() {
    return (
        <SldrsCtxProvider>
            <main>
                <h1>Hello</h1>
                <ThreeCanvas />
                <Sliders />
            </main>
        </SldrsCtxProvider>
    );
}