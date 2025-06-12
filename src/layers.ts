import P5 from "p5";
import type { Controller } from "./controller";
import { ControlledObject } from "./controllerObject";
import { LayerRecording } from "./layerRecording";
import { LayerStream } from "./layerStream";

export class Layers extends ControlledObject {

    protected _ready: boolean = false;
    public get ready() { return this._ready; }

    static color: string = "green";

    private _recording!: LayerRecording;
    public get recording() {
        if (!this._recording) throw new Error("trying to access the recording before its initialisation");
        return this._recording;
    }


    private _stream!: LayerStream;
    public get stream() {
        if (!this._stream) throw new Error("trying to access the stream before its initialisation");
        return this._stream;
    }

    private _combined!: P5.Graphics;
    public get combined() {
        if (!this._combined) {
            throw new Error("Accessing combined canvas before its initialisation");
        }
        return this._combined;
    }

    private shader: P5.Shader | undefined;

    constructor(
        controller: Controller
    ) {
        super(controller);

        this.p5.loadShader(
            "/shaders/mist.vert",
            "/shaders/mist.frag",
            result => {
                this.shader = result;
                // this.log("shader loaded", this.shader);
            }
        );

    }


    init(
        inputWidth: number,
        outputWidth: number
    ) {

        if (this._ready) {
            return;
        }

        this._combined = this.p5.createGraphics(
            this.mapping.output.width, this.mapping.output.height
        );

        this._recording = new LayerRecording(this.controller, "red", inputWidth, outputWidth);
        this._stream = new LayerStream(this.controller, "cyan", inputWidth, outputWidth);

        this._ready = true;

        this.log("Initialised", this);

    }


    update() {
        if (this.ready === true) {
            this.stream.processStream();
            this.recording.processStream();
        }
    }

    combine() {
        if (this.ready === true) {

            this.combined.blendMode(this.p5.BLEND);

            this.combined.fill(0);
            this.combined.rect(0, 0, this.combined.width, this.combined.height);

            this.stream.drawToCombined();
            // this.recording.drawToCombined();

        }
    }

    draw() {
        if (this.ready === true) {

            this.p5.image(
                this.combined, 
                -this.mapping.output.width / 2,
                -this.mapping.output.height / 2, 
                this.mapping.output.width, 
                this.mapping.output.height
            );

        }
    }




}