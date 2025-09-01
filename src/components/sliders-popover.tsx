import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";


export function SlidersPopover({ children }: { children: React.ReactNode }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size='icon' variant='outline' className='rounded-full absolute bottom-2 left-2'><Settings /></Button>
            </PopoverTrigger>
            <PopoverContent className="m-2 w-[300px] bg-transparent backdrop-blur-2xl">
                {children}
            </PopoverContent>
        </Popover>
    );
}