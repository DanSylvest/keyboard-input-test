import React from 'react';
import {fireEvent, render} from "@testing-library/react";
import ResultOutput from "../ResultOutput/ResultOutput";


const setup = () => {
    const utils = render(<ResultOutput />);
    const textarea = utils.getByTestId('textarea');
    const canvas = utils.getByTestId('canvas');
    const testInput = utils.getByTestId('debug-input');

    return {
        textarea,
        canvas,
        testInput,
        ...utils,
    }
}

/*
* Как оно вообще должно работать:
*
* Через keydown отслеживаются какие кнопки были нажаты и соответственно показываются связки клавиш
* Через input прослушивается ввод скрытого поля, что бы можно было получить результат ввода
* связок клавиш таких как Shift+<symbol> или Unicod'a или ввода с нумпада.
* Вообщем всего, что определено поведением системы под которой работает браузер.
* Поэтому всегда когда inputType = insertText | insertCompositionText это значение будет перекрывать событие keydown.
*
*
* */
describe ('ResultOutput test:', () => {
    let res:any;

    beforeEach(() => {
        res = setup();
    });

    test("focusing", async () => {
        expect(res.testInput).toHaveTextContent("click here!");
        fireEvent.mouseDown(res.canvas, {});
        expect(res.testInput).toHaveTextContent("press the buttons!");
        fireEvent.blur(res.textarea);
        expect(res.testInput).toHaveTextContent("click here!");
    })

    test("should output 'Control+Shift+a'", () => {
        fireEvent.mouseDown(res.canvas, {});
        fireEvent.keyDown(res.textarea, {key: "d", code: "KeyD", which: 63, keyCode: 63, shiftKey: true, ctrlKey: true});
        expect(res.testInput).toHaveTextContent("Control+Shift+d");
    });

    test("should output 'D'", () => {
        fireEvent.mouseDown(res.canvas, {});
        fireEvent.keyDown(res.textarea, {key: "D", code: "KeyD", which: 63, keyCode: 63, shiftKey: true});
        expect(res.testInput).toHaveTextContent("Shift+d");
        fireEvent.input(res.textarea, {data: "D", inputType: "insertText"});
        expect(res.testInput).toHaveTextContent("D");
    });

    test("should output 'В'", () => {
        fireEvent.mouseDown(res.canvas, {});
        fireEvent.keyDown(res.textarea, {key: "В", code: "KeyD", which: 63, keyCode: 63, shiftKey: true});
        expect(res.testInput).toHaveTextContent("Shift+d");
        fireEvent.input(res.textarea, {data: "В", inputType: "insertText"});
        expect(res.testInput).toHaveTextContent("В");
        expect(res.testInput).not.toHaveTextContent("D");
    });

    // this is an example input of unicode in linux
    test("should show '☺'", () => {
        fireEvent.mouseDown(res.canvas, {});
        fireEvent.keyDown(res.textarea, {key: "Control", code: "ControlLeft", which: 17, keyCode: 17, ctrlKey: true});
        expect(res.testInput).toHaveTextContent("Control");
        fireEvent.keyDown(res.textarea, {key: "Shift", code: "ShiftLeft", which: 16, keyCode: 16, ctrlKey: true, shiftKey: true});
        expect(res.testInput).toHaveTextContent("Control+Shift");

        // all next keydown events will return keyCode 229 and key Unidentified
        // i will skip it
        fireEvent.input(res.textarea, {data: "u", inputType: "insertCompositionText"});
        expect(res.testInput).toHaveTextContent("u");
        fireEvent.input(res.textarea, {data: "u2", inputType: "insertCompositionText"});
        expect(res.testInput).toHaveTextContent("u2");
        fireEvent.input(res.textarea, {data: "u26", inputType: "insertCompositionText"});
        expect(res.testInput).toHaveTextContent("u26");
        fireEvent.input(res.textarea, {data: "u263", inputType: "insertCompositionText"});
        expect(res.testInput).toHaveTextContent("u263");
        fireEvent.input(res.textarea, {data: "u263a", inputType: "insertCompositionText"});
        expect(res.testInput).toHaveTextContent("u263a");

        // here you should press enter - but it to is Unidentified
        fireEvent.input(res.textarea, {data: "☺", inputType: "insertCompositionText"});
        expect(res.testInput).toHaveTextContent("☺");
    });
});