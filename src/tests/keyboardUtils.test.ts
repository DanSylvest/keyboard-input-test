import {isModifier, isNumpadKey, isSymbolKey} from "../utils/keyboardUtils";

describe("Keyboard Utils:", () => {

    test("isNumpadKey should say us what key is numpad", () => {

        expect(isNumpadKey("Numpad0")).toBe(true);
        expect(isNumpadKey("NumpadEnter")).toBe(true);
        expect(isNumpadKey("KeyU")).toBe(false);

    });

    test("isSymbolKey should say us what key is symbol", () => {

        expect(isSymbolKey("KeyF")).toBe(true);
        expect(isSymbolKey("Digit0")).toBe(true);
        expect(isSymbolKey("Equal")).toBe(true);
        expect(isSymbolKey("Numpad2")).toBe(false);
        expect(isSymbolKey("MetaRight")).toBe(false);
        expect(isSymbolKey("F8")).toBe(false);

    });

    test("isModifier should say us what key is modifier", () => {

        expect(isModifier("ControlLeft")).toBe(true);
        expect(isModifier("ShiftLeft")).toBe(true);
        expect(isModifier("MetaRight")).toBe(true);
        expect(isModifier("AltLeft")).toBe(true);
        expect(isModifier("MetaRight")).toBe(true);
        expect(isModifier("Meta")).toBe(false);
        expect(isModifier("F8")).toBe(false);

    });



});