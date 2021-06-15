import {eqArrays} from "../utils/usefulFunctions";

describe("Useful Functions:", () => {

    test("eqArrays should compare two arrays", () => {
        const arrA = ["Control", "Shift"];
        const arrB = ["Control", "Shift"];

        expect(eqArrays(arrA, arrB)).toBe(true);
    });

});