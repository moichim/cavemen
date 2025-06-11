import type { Capture } from "./capture";
import type { Controller } from "./controller";
import P5 from "p5";
import type { Mapping } from "./mapping";
import type { Layers } from "./layers";

export abstract class ControlledObject {

    static color: string = "black";

    protected readonly p5: P5;
    protected get capture(): Capture { return this.controller.capture; }
    protected get mapping(): Mapping { return this.controller.mapping;}
    protected get layers(): Layers { return this.controller.layers; }

    constructor(
        protected readonly controller: Controller
    ) {
        this.p5 = this.controller.p5;
    }

    log( ...args: any[] ) {
        const color = (this.constructor as typeof ControlledObject).color;
        console.log( 
            `%c${this.constructor.name}`, 
            `font-weight: bold; color: ${color};`, 
            ">",
            this.p5.frameCount,
            ">",
            ...args 
        );
    }

}