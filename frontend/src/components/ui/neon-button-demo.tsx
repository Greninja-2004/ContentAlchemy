import { Button } from "@/components/ui/neon-button";
import React from "react";

const Default = () => {
    return (
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button>Button</Button>
            <WithNoNeon />
            <Solid />
        </div>
    );
}

const WithNoNeon = () => {
    return (
        <div className="flex flex-col gap-2">
            <Button neon={false}>normal button</Button>
        </div>
    );
}

const Solid = () => {
    return (
        <div className="flex flex-col gap-2">
            <Button variant="solid">solid</Button>
        </div>
    );
}

export { Default, WithNoNeon, Solid };
