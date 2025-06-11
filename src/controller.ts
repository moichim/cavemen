import P5 from "p5";
import { Capture } from "./capture";
import { Mapping } from "./mapping";
import { Layers } from "./layers";

export class Controller {

    static color: string = "black";

    public readonly capture: Capture;
    public readonly mapping: Mapping;
    public readonly layers: Layers;

    constructor( 
        public readonly p5: P5 
    ) {
        this.capture = new Capture( this );
        this.mapping = new Mapping( this );
        this.layers = new Layers( this );
    }

    update() {

        this.layers.update();
        this.layers.combine();

    }

    draw() {
        this.capture.draw();
        this.layers.draw();
    }

}