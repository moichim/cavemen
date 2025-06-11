import P5 from "p5";
import { Capture } from "./capture";
import { Mapping } from "./mapping";
import { Layers } from "./layers";
import { ControlledObject } from "./controllerObject";

export class Controller {

    static color: string = "black";

    public readonly capture: Capture;
    public readonly mapping: Mapping;
    public readonly layers: Layers;

    protected _debug: boolean = false;
    public get debug() { return this._debug; }

    constructor( 
        public readonly p5: P5 
    ) {
        this.capture = new Capture( this );
        this.mapping = new Mapping( this );
        this.layers = new Layers( this );
    }

    update() {

        if ( this._debug ) {
            this.addDebug( this, "Frame rate", this.p5.frameRate() );
            this.addDebug( this, "Frame count", this.p5.frameCount );
        }

        this.layers.update();
        this.layers.combine();

    }

    draw() {
        this.layers.draw();

        if ( this._debug ) {
            this.drawDebug();
        }
    }

    protected debugBuffer: Map<string,{ component: Controller|ControlledObject, value: number|string|boolean }> = new Map;

    public addDebug(
        component: Controller|ControlledObject,
        label: string,
        value: number|string|boolean
    ) {
        this.debugBuffer.set( label, { component, value } );
    }

    protected drawDebug() {


        const numItems = this.debugBuffer.size;
        const rowHeight = 20;
        const gap = 5;
        const height = numItems * 20;


        this.p5.blendMode( this.p5.BLEND );

        this.p5.push();

        this.p5.translate( 10, 10 );

        this.p5.fill(255);
        this.p5.rect( 0, 0, 500 + ( gap * 2 ), height + ( gap * 2 ) );

        Array.from( this.debugBuffer.entries() ).map( ( [label, { component, value } ], index ) => {

            const color = component instanceof ControlledObject
                ? ( component.constructor as typeof ControlledObject).color
                : "black";
            const className = component.constructor.name;
            const text = `${className} > ${label} = ${value.toString()}`;
            const top = gap + rowHeight * ( index + 1 );

            this.p5.fill( color );
            this.p5.textSize( rowHeight / 1.5 );

            this.p5.text( text, gap, top );

        } );

        this.p5.pop();

        this.debugBuffer.clear();

        this.capture.draw();

    }

    public setDebug(
        value: boolean
    ): Controller {
        this._debug = value;
        return this;
    }

}