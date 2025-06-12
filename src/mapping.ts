import P5 from "p5";
import type { Controller } from "./controller";
import { ControlledObject } from "./controllerObject";

type Dimensions = {
    width: number,
    height: number
}

export class Mapping extends ControlledObject {

    static color: string = "blue";

    protected _input!: Dimensions;
    public readonly output: Dimensions;
    public get input() {
        if ( !this._input ) {
            throw new Error( "Input resolution accessed before initialisation" );
        }
        return this._input;
    }

    constructor(
        controller: Controller
    ) {
        super( controller );

        this.output = {
            width: this.p5.width,
            height: this.p5.height
        };
    }

    public setInputResolution(
        width: number,
        height: number
    ) {
        this._input = { width, height };
        this.log( "Input resolution set" );
    }

    public xInputToOutput(
        xInput: number
    ) {
        return xInput * this.output.width / this.input.width;
    }

    public yInputToOutput(
        yInput: number
    ) {
        return yInput * this.output.height / this.input.height;
    }

    public vectorInputToOutput(
        vectorInput: P5.Vector
    ) {
        return new P5.Vector(
            this.xInputToOutput(vectorInput.x),
            this.yInputToOutput(vectorInput.y)
        );
    }



}