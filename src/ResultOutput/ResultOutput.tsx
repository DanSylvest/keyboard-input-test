import React, {useEffect, useRef, useState} from "react";
import CanvasHelper from "./canvasHelper";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./constansts";
import './ResultOutput.css'
import KeyboardInputListener from "../utils/keyboardInputListener";

let canvas:CanvasHelper;
const messages = {
    click: "click here!",
    press: "press the buttons!"
}

function ResultOutput () {
    const cnv: any = useRef(null);
    const textarea: any = useRef(null);
    const [symbol, setSymbol] = useState(messages.click);

    useEffect(() => {
        canvas = new CanvasHelper(cnv.current);

        let keyboardListener = new KeyboardInputListener({
            element: textarea.current,
            onChange: (symbol: string) => setSymbol(symbol)
        });
        keyboardListener.init();

        return () => {
            canvas.destructor();
            keyboardListener.deinit();
        }
    }, [])

    useEffect(() => {
        canvas.drawSymbol(symbol);
    }, [symbol]);

    const onCanvasMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        textarea.current.focus();
    }

    const onFocus = () => {
        setSymbol(messages.press)
        cnv.current.classList.toggle("focused");
    }

    const onBlur = () => {
        setSymbol(messages.click)
        cnv.current.classList.toggle("focused");
    }

    return <div className="ResultOutput">
        <div data-testid='debug-input' className='testOutput'>{symbol}</div>
        <textarea ref={textarea} onBlur={onBlur} onFocus={onFocus} data-testid="textarea"/>
        <canvas ref={cnv} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onMouseDown={onCanvasMouseDown as any} data-testid="canvas" />
    </div>

}

export default ResultOutput;