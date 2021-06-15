import {keys, KeyType, modifiers} from "./keysInfo";

// Мапка KeyboardEvent.code : KeyboardEvent.key
export const keyByCode = keys.reduce((acc:any, x:KeyType) => {
    acc[x.code as any] = x.key;
    return acc;
}, {});

// Список кодов для модификаторов
export const modifiersCodes:Array<String> = keys
    .filter((x:KeyType) => x.purpose === "modifier")
    .map((x:KeyType) => x.code);

// Список кодов для символов
export const symbolsCodes:Array<String> = keys
    .filter((x:KeyType) => x.purpose === "symbol")
    .map((x:KeyType) => x.code);

// keyCode поддерживается почти везде, в отличии от code
// так что эта мапка нужна для совместимости.
export const codesByKeyCode:any = keys.reduce((acc:any, x:KeyType) => {
    acc[x.keyCode as any] = x.code;
    return acc;
}, {});

export const numpadKeys:Array<String> = keys
    .filter((x:KeyType) => x.purpose === "numpad")
    .map((x:KeyType) => x.code);

export interface NormalizedKeyboardEvent {
    key: string,
    code: string,
    keyCode: number,
    altKey: boolean,
    shiftKey: boolean,
    metaKey: boolean,
    ctrlKey: boolean
}

// исхожу из того, что других комбинация модифаеров не бывает.
// Дальше уже идут обычные клавиши.
// Кроме того считаю, что левая или правая клавиша неважно в случае с шифтом, метой и альтом
export const getModifiers = ({ctrlKey, metaKey, altKey, shiftKey}:NormalizedKeyboardEvent):Array<String> => {
    if (ctrlKey && altKey && shiftKey)  // почему-то на арче выдает groupNext и не детектит
        return [modifiers.ctrl, modifiers.alt, modifiers.shift]

    if (altKey && shiftKey)  // почему-то на арче выдает groupNext и не детектит
        return [modifiers.alt, modifiers.shift]

    if (ctrlKey && altKey)
        return [modifiers.ctrl, modifiers.alt]

    if (ctrlKey && shiftKey)
        return [modifiers.ctrl, modifiers.shift]

    if (ctrlKey)
        return [modifiers.ctrl];

    if (shiftKey)
        return [modifiers.shift];

    if (altKey)
        return [modifiers.alt];

    if (metaKey)
        return [modifiers.meta];

    return [];
}

export function normalizeKeyboardEvent({key, code, which, charCode, keyCode, altKey, shiftKey, metaKey, ctrlKey}: KeyboardEvent):NormalizedKeyboardEvent {
    // тут так же стоит заметить, что keyCode тоже есть не везде,
    // поэтому я на всякий случай и его вначале проверю
    if (keyCode === undefined) {
        keyCode = which;
    }

    // вообще KeyboardEvent.code - не поддерживается, на довольно старых версиях браузеров
    // а так же на мобильных браузерах.
    // но на всякий случая я буду проверять что code отсутствует и подставлять из таблицы нужный код
    if (code === undefined) {
        code = codesByKeyCode[keyCode]
    }

    console.log({key, code, which, charCode, keyCode, altKey, shiftKey, metaKey, ctrlKey})

    return {key, code, keyCode, altKey, shiftKey, metaKey, ctrlKey}
}

export function isNumpadKey(key:String):Boolean {
    return numpadKeys.includes(key);
}

export function isSymbolKey(key:String):Boolean {
    return symbolsCodes.includes(key)
}

export function isModifier(key:String):Boolean {
    return modifiersCodes.includes(key);
}