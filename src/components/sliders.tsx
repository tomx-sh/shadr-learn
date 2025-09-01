"use client"
import { useState, createContext, useContext } from "react";
import { Slider as ShadSlider } from "./ui/slider";

const sldrs = [
    { label: 'maxDistance', min: 0, max: 1000, step: 1, initialValue: 451 },
    { label: 'exponent', min: 0, max: 10, step: 0.01, initialValue: 10 },
    { label: 'curve', min: 0, max: 3, step: 0.01, initialValue: 0.36 },
    { label: 'zoom', min: 0, max: 1, step: 0.001, initialValue: 0.7 },
    { label: 'frequency', min: 0, max: 20, step: 0.1, initialValue: 2 },
    { label: 'speed', min: -2, max: 2, step: 0.01, initialValue: 0.1 },
] as const

type SldrsLabel = typeof sldrs[number]['label']
type SldrsCtx = {
    values: Record<SldrsLabel, number>;
    setValue: (label: SldrsLabel, value: number) => void;
}

const SldrsContext = createContext<SldrsCtx | undefined>(undefined);

export function SldrsCtxProvider({ children }: { children: React.ReactNode }) {
    const [values, setValues] = useState<Record<SldrsLabel, number>>(
        () => sldrs.reduce((acc, { label, initialValue }) => {
            acc[label] = initialValue;
            return acc;
        }, {} as Record<SldrsLabel, number>)
    );

    const setValue = (label: SldrsLabel, value: number) => {
        setValues((prev) => ({ ...prev, [label]: value }));
    };

    return (
        <SldrsContext.Provider value={{ values, setValue }}>
            {children}
        </SldrsContext.Provider>
    );
}

export function useSlidersValues() {
    const ctx = useContext(SldrsContext);
    if (!ctx) throw new Error("Sliders must be used within a SldrsProvider");
    return ctx.values;
}

export function Sliders() {
    const ctx = useContext(SldrsContext);
    if (!ctx) throw new Error("Sliders must be used within a SldrsProvider");
    const { values, setValue } = ctx;

    return (
        <div>
            {sldrs.map(({ label, min, max, step }) => (
                <Slider
                    key={label}
                    label={label}
                    min={min}
                    max={max}
                    step={step}
                    value={values[label]}
                    onChange={(value) => setValue(label, value)}
                />
            ))}
        </div>
    );

}


type SliderProps = {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
}

function Slider({ label, min, max, step, value, onChange }: SliderProps) {
    return (
        <div className="flex items-center">
            {/* <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            /> */}
            <ShadSlider
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={([value]) => onChange(value)}
                className="w-[100px]"
            />
            <label className="mx-3">{label}</label>
            <span className='font-mono text-sm opacity-50'>{value}</span>
        </div>
    );
}