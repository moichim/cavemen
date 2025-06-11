import P5 from "p5";
import { Controller } from "./controller";



const sketch = ( p5: P5 ) => {

    let controller: Controller;

    let shader: P5.Shader|undefined = undefined;

    p5.setup = () => {

        p5.frameRate( 30 );

        const canvas = p5.createCanvas( window.innerWidth, window.innerHeight, p5.WEBGL );
        canvas.parent( "app" );

        p5.background( "black" );

        controller = new Controller( p5 );
        controller.setDebug( true );

    }

    p5.draw = () => {
        controller.update();
        controller.draw();
    }

}

new P5( sketch );