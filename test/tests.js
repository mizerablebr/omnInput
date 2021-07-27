class OmnInputTests {
    static omniInput;
    static testDoc = $('<html><body><div id="outsideContainer"><div id="omnInputContainer"></div></div></body></html>');

    static setUp() {
        const keys = [{label: 'Plate', id: 'plate'}, {label: 'Brand', id: 'brand'}, {label: 'Model', id: 'model'}];
        const componentId = 'omnInputContainer';
        const postUrl =  '/post';

        OmnInputTests.omnInput = OmnInput.create(keys, componentId, postUrl, OmnInputTests.testDoc);
    }

    static afterCreateOmnInputThenSearchBoxIsCreated() {
        return assertTrue(OmnInputTests.testDoc.find('.search-box').length > 0);
    }

    static afterCreateOmnInputThenSearchMenuIsCreated() {
        return assertTrue(OmnInputTests.testDoc.find('.search-menu').length > 0);
    }

    static afterCreateOmnInputThenSearchInputBoxIsCreated() {
        return assertTrue(OmnInputTests.testDoc.find('.search-input-box').length > 0);
    }

    static afterCreateOmnInputThenSearchInputIsCreated() {
        return assertTrue(OmnInputTests.testDoc.find('.search-input').length > 0);
    }

    static afterCreateOmnInputThenMessageContainerIsCreated() {
        return assertTrue(OmnInputTests.testDoc.find('#messageContainer').length > 0);
    }

    static givenPressingEnterOnValueModeWithInputNotEmptyThenCreateSearchValueFromInput() {
        let eventMock = {target: {value: "notEmpty"}, key: 'Enter', data: {createSearchValueFromInput(){console.log('executed')}, searchInput : {data(){return true}, val(){}}}};
        OmnInputTests.omnInput.handleInputKeyPress(eventMock);
    }

}

function assertEquals(a, b) {
    return a === b ? 'passed' : 'fail';
}

function assertTrue(a) {
    return assertEquals(a, true)
}

function assertNotEquals(a, b) {
    return a !== b ? 'passed' : 'fail';
}