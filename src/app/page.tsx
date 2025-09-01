import ThreeCanvas from "@/components/three-canvas";
import { Sliders } from "@/components/sliders";
import { SldrsCtxProvider } from "@/components/sliders";
import { SlidersPopover } from "@/components/sliders-popover";

export default function Home() {
    return (
        <SldrsCtxProvider>
            <main className="h-screen w-screen flex flex-col items-center justify-center">
                <ThreeCanvas />
                <SlidersPopover>
                    <Sliders />
                </SlidersPopover>
            </main>
        </SldrsCtxProvider>
    );
}