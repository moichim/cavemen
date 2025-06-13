import type { Image, Element } from "p5";
import { LayerAbstract } from "./layerAbstract";

export class LayerStream extends LayerAbstract {
    protected getCurrentInput(): Image | Element {
        throw new Error("Method not implemented.");
    }
    
    static color: string = "navy";

    public update(): void {}

    public doRender() {

        this.renderInputToOutput(
            this.capture.video
        );

    }

    public getCurrentRender() {
        return this.render;
    }
    
    
}