class OmnInputTests {
    static omnInput;
    static testContext = $('<html><body><div id="outsideContainer"><div id="omnInputContainer"></div></div></body></html>');

    static setUp() {
        const keys = [{label: 'Plate', id: 'plate'}, {label: 'Brand', id: 'brand'}, {label: 'Model', id: 'model'}];
        const componentId = 'omnInputContainer';
        const postUrl =  '/post';

        OmnInputTests.omnInput = OmnInput.create(keys, componentId, postUrl, OmnInputTests.testContext);
    }

    static afterCreateOmnInputThenSearchBoxIsCreated() {
        return assertTrue(OmnInputTests.testContext.find('.search-box').length > 0);
    }

    static afterCreateOmnInputThenSearchMenuIsCreated() {
        return assertTrue(OmnInputTests.testContext.find('.search-menu').length > 0);
    }

    static afterCreateOmnInputThenSearchInputBoxIsCreated() {
        return assertTrue(OmnInputTests.testContext.find('.search-input-box').length > 0);
    }

    static afterCreateOmnInputThenSearchInputIsCreated() {
        return assertTrue(OmnInputTests.testContext.find('.search-input').length > 0);
    }

    static afterCreateOmnInputThenMessageContainerIsCreated() {
        return assertTrue(OmnInputTests.testContext.find('#messageContainer').length > 0);
    }

    static givenPressingEnterOnValueModeWithInputNotEmptyThenCreateSearchValueFromInput() {
        let invokedCreateSearchValueFromInput = false;
        let eventMock = {target: {value: "notEmpty"}, key: 'Enter', data: {createSearchValueFromInput(){invokedCreateSearchValueFromInput = true}, searchInput : {data(){return true}, val(){}}}};

        OmnInputTests.omnInput.handleInputKeyPress(eventMock);

        return assertTrue(invokedCreateSearchValueFromInput);
    }

    static givenAddKeyToSearchBoxThenSetValueModeAndAddSearchKey() {
        let validations = [];
        const searchInput = OmnInputTests.omnInput.searchInput;
        const searchBox = OmnInputTests.omnInput.searchBox;
        const isValueMode = function() {return searchInput.data('value-mode')}
        validations.push(assertFalse(isValueMode()));

        OmnInputTests.omnInput.addKeyToSearchBox('myKey');

        validations.push(assertTrue(isValueMode()));
        const hasSearchKey = function() {return searchBox.find('.search-key').length > 0}
        validations.push(assertTrue(hasSearchKey()));
        return assertNotContains(validations, FAIL);
    }

    static givenCreateSearchValueFromInputThenAddValueItemWithDeleteElement() {
        let validations = [];
        const EXPECTED_VALUE = 'myValue';
        OmnInputTests.omnInput.addKeyToSearchBox('myKey');
        OmnInputTests.testContext.find('.search-input').val(EXPECTED_VALUE);

        OmnInputTests.omnInput.createSearchValueFromInput();

        const hasSearchValueWithValue = function(expectedValue) {return $(OmnInputTests.omnInput.searchBox.find('.search-value')[0]).data('value') === expectedValue;}
        const hasDeleteElement = function() {return OmnInputTests.omnInput.searchBox.find('.search-item-delete').length > 0;}
        validations.push(assertTrue(hasSearchValueWithValue(EXPECTED_VALUE)));
        validations.push(assertTrue(hasDeleteElement()));
        return assertNotContains(validations, FAIL);
    }

    static givenClickEventOnSearchItemDeleteThenRemoveTheParentValueAndItsKey() {
        let validations = [];
        const addTwoKeyValuePairs = function() {OmnInputTests.omnInput.loadFromObject({"plate": "abc1234", "model": "fusca"});};
        const countKeyValuePairs = function() {return OmnInputTests.omnInput.searchBox.find('.search-item-delete').length}
        const clickFirstDeleteElement = function () {$(OmnInputTests.omnInput.searchBox.find('.search-item-delete')[0]).trigger('click')}
        console.log(countKeyValuePairs());
        addTwoKeyValuePairs();
        console.log($(OmnInputTests.omnInput.searchBox.find('.search-item-delete')[0]));
        $(OmnInputTests.omnInput.searchBox.find('.search-item-delete')[0]).trigger('click')
        console.log(countKeyValuePairs());
        validations.push(assertEquals(countKeyValuePairs(), 2));
        console.log(validations);

        clickFirstDeleteElement();

        console.log(countKeyValuePairs());
        validations.push(assertEquals(countKeyValuePairs(), 1));
        console.log(countKeyValuePairs());
        console.log(validations);
        return assertNotContains(validations, FAIL);
    }


}
const FAIL = "fail";

function assertEquals(a, b) {
    return a === b ? 'passed' : FAIL;
}

function assertTrue(a) {
    return assertEquals(a, true)
}

function assertFalse(a) {
    return assertEquals(a, false)
}

function assertNotEquals(a, b) {
    return a !== b ? 'passed' : 'fail';
}

function assertNotContains(array, item) {
    return assertTrue(array.filter(arrayItem => arrayItem === item).length === 0);
}