import {Observable, fromEvent} from 'rxjs'
import {distinctUntilChanged, mergeWith, map, filter} from 'rxjs/operators'
import {
    keyByCode,
    NormalizedKeyboardEvent,
    normalizeKeyboardEvent,
    getModifiers,
    isModifier,
    isNumpadKey,
    isSymbolKey
} from "./keyboardUtils";
import {eqArrays} from "./usefulFunctions";


/*
* Пояснения:
* 0) Исхожу из того, что под IE не нужно делать.
* 0.1) проверил на FF, Chrome, Edge, Opera, Safari работает. На IE 11 нет.
*
* 2) Я исхожу из того, что модификаторами являются Control, Alt, Shift и Meta.
* так же есть управляющие команды типа стрелок вправо, влево и тд.
* для тестового задания я их буду отображать, но с их названиями, прописаными в KeyboardEvent.key
*
* 3) Так же, я исхожу из того, что множественное нажатие клавиш
* не предполагает определенной последовательности ввода, за исключением ввода Юникода
* т.е. нажатие на CTRL => ALT или ALT => CTRL всегда выведет CTRL + ALT
*
* 4) У меня на машине стоит Arch Linux и он выдает довольно любопытное поведение
* если нажать ctrl + shift + a - текстовое поле не теряет фокус, но исчезает курсор
* и textarea перестает отсылать событие Input
*
* 5) Я тут еще не очень освоился с типами, поэтому у меня тут много any
*
* */

interface KeyboardInputListenerProperties {
    onChange: Function,
    element: HTMLElement
}

class KeyboardInputListener {
    inputPipe$: Observable<Array<any>> | null = null;
    subscription: any | null = null;
    onChange: Function;
    element: any | null = window;

    constructor({onChange, element}: KeyboardInputListenerProperties) {
        this.onChange = onChange;

        if (element)
            this.element = element;
    }

    init() {
        this.createInputStream();
    }

    deinit() {
        this.onChange = () => {}
        this.subscription.unsubscribe();
        this.subscription = null;
        this.inputPipe$ = null;
    }

    createInputStream() {
        let keydown$: Observable<KeyboardEvent> = fromEvent(this.element, "keydown");
        let input$: Observable<InputEvent> = fromEvent(this.element, "input");

        let keydownPipe$ = keydown$.pipe(
            map((event: KeyboardEvent): KeyboardEvent => {
                if (event.code === "Enter" || event.code === "NumpadEnter")
                    event.preventDefault();

                return event;
            }),
            map((event: KeyboardEvent): NormalizedKeyboardEvent => normalizeKeyboardEvent(event)),
            map(this.scanInput.bind(this)),
            distinctUntilChanged(eqArrays)
        )

        let inputTextareaPipe$ = input$.pipe(
            filter((event: InputEvent) => event.inputType === "insertText" || event.inputType === 'insertCompositionText'),
            map((event: InputEvent): Array<string> => [event.data as string])
        )

        this.inputPipe$ = keydownPipe$.pipe(
            mergeWith(inputTextareaPipe$)
        )

        this.subscription = this.inputPipe$.subscribe((event) => {
            this.onChange(event.join('+'));
        });
    }

    scanInput(value: NormalizedKeyboardEvent):Array<String> {
        let symbolSequence: Array<String>;
        let modifiersList: Array<String> = getModifiers(value);
        let lastKeyIsModifier: Boolean = isModifier(value.code);

        let key: String = value.key;
        if (!(isNumpadKey(value.code) || isSymbolKey(value.code)))
            key = keyByCode[value.code];

        if (modifiersList.length > 0 && !lastKeyIsModifier)
            key = keyByCode[value.code];

        if (!lastKeyIsModifier)
            symbolSequence = [...modifiersList, key];
        else
            symbolSequence = modifiersList;

        return symbolSequence;
    }
}

export default KeyboardInputListener;