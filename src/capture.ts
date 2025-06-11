import P5 from "p5";
import type { Controller } from "./controller";
import { ControlledObject } from "./controllerObject";

export class Capture extends ControlledObject {

    static color: string = "gray";

    public readonly video: P5.Element;

    protected width: number = 0;
    protected height: number = 0;

    protected _ready: boolean = false;
    public get ready() { return this._ready; }

    constructor(
        controller: Controller
    ) {

        super( controller );

        this.video = this.p5.createCapture( "video" );
        this.video.hide();

        (this.video.elt as HTMLVideoElement).onloadedmetadata = () => {

            this.width = this.video.elt.videoWidth;
            this.height = this.video.elt.videoHeight;

            this.mapping.setInputResolution(
                this.width,
                this.height
            );

            this.layers.init( this.width, this.height );

            this._ready = true;

            this.log( "metadata loaded" );

        }

    }

    public draw() {

        if ( !this.ready ) {
            return;
        }

        this.p5.image( this.video, 100, 100, this.mapping.input.width, this.mapping.input.height );

    }

}