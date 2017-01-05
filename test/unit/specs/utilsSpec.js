'use strict';

describe('Utils', function () {
    it('isArray', function () {
        expect(isArray([])).toBe(true);
        expect(isArray(ko.observableArray([]))).toBe(false);
        expect(isArray(function () {})).toBe(false);
        expect(isArray(undefined)).toBe(false);
        expect(isArray(null)).toBe(false);
    });

    it('isFunction', function () {
        expect(isFunction(function () {})).toBe(true);
        expect(isFunction(ko.observableArray([]))).toBe(true);
        expect(isFunction([])).toBe(false);
        expect(isFunction(undefined)).toBe(false);
        expect(isFunction(null)).toBe(false);
    });

    it('isObservableArray', function () {
        expect(isObservableArray(ko.observableArray([]))).toBe(true);
        expect(isObservableArray(ko.observable())).toBe(false);
        expect(isObservableArray(function () {})).toBe(false);
        expect(isObservableArray([])).toBe(false);
        expect(isObservableArray(undefined)).toBe(false);
        expect(isObservableArray(null)).toBe(false);
    });

    it('isArrayOrObsArray', function () {
        expect(isArrayOrObsArray([])).toBe(true);
        expect(isArrayOrObsArray(ko.observableArray([]))).toBe(true);
        expect(isArrayOrObsArray(ko.observable())).toBe(false);
        expect(isArrayOrObsArray(function () {})).toBe(false);
        expect(isArrayOrObsArray(undefined)).toBe(false);
        expect(isArrayOrObsArray(null)).toBe(false);
    });

    it('isFuncNotObsArray', function () {
        expect(isFuncNotObsArray(function () {})).toBe(true);
        expect(isFuncNotObsArray([])).toBe(false);
        expect(isFuncNotObsArray(ko.observableArray([]))).toBe(false);
        expect(isFuncNotObsArray(ko.observable())).toBe(false);
        expect(isFuncNotObsArray(undefined)).toBe(false);
        expect(isFuncNotObsArray(null)).toBe(false);
    });
});

describe('KO Extenders', function () {
    it('nssgSingleSelect', function () {
        var obs = ko.observableArray([]).extend({ nssgSingleSelect: true });

        obs.push(1);
        expect(obs().length).toBe(1);

        obs.push(2);
        expect(obs().length).toBe(1);

        obs([1, 2, 3]);
        expect(obs().length).toBe(1);
    });
});
