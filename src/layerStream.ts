import { LayerAbstract } from "./layerAbstract";

export class LayerStream extends LayerAbstract {
    
    static color: string = "navy";

    public processStream(): void {
        this.drawInternal( this.capture.video );
    }

    public getCurrentImage() {
        return this.graphics;
    }
    
    
}