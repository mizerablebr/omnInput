class OmnInput {
    constructor(keys, containerId, action, scope) {
        this.keys = keys;
        this.containerId = containerId;
        this.action = action;
        this.searchMenu = {};
        this.searchBox = {};
        this.searchInputBox = {};
        this.searchInput = {};
        this.messagemContainer = {};
        this.scope = scope;
        this.searchBoxContainerTemplate = '<div class="search-box border mx-3 mt-3 mb-3 p-2 d-flex bg-white" style="overflow-x: auto"><div class="search-input-box d-flex flex-grow-1" data-toggle="dropdown"><input class="search-input flex-grow-1 text-uppercase" data-value-mode="false" type="text" style="border: 0; outline:0;"/></div><div class="search-menu dropdown-menu mt-5" aria-labelledby="dropdownMenuButton"></div></div><div class="text-danger ml-3 mb-3"><small id="messageContainer" style="display: none;"></small></div>'
        this.keyItem = '<div class="search-item search-key px-1 mr-1 text-uppercase" data-key="{}" style="color: #707070; background-color: #dbdbdb; padding-top: .20rem;"><span>{}</span>:</div>'
        this.valueItem = '<div class="search-item search-value px-1 mr-3 text-uppercase" data-value="{}" style="background-color: #dbdbdb; padding-top: .20rem;">{}<span class="search-item-delete ml-1 px-1 text-lowercase font-weight-bold" style="vertical-align: top;">x</span></div>'
        this.menuItem = '<a class="menu-search-key dropdown-item" data-key="{}" href="#">{}</a>';

        this.initialSetup(this.scope);

        this.addListenerToSearchKeys();
        this.addListenerToSearchInput();
        this.addListenerToSearchItemDelete();
    }

    aditionalFormInput(aditionalInput) {
        this.aditionalInput = aditionalInput;
        return this;
    }

    static create(keys, containerId, action, scope) {
        if (!Array.isArray(keys) || keys[0].label === undefined || keys[0].id === undefined)
            throw "Each item from the Array Keys must be a Object containing Label and Id. Ex.: {label: 'My Label', id: 'myId'}"
        return new OmnInput(keys, containerId, action, scope);
    }

    formatTemplate(term, template) {
        return template.replace(/\{\}/g, term);
    }
    

    initialSetup(scopeToUse) {
        let scope = $('#' + this.containerId, scopeToUse);
        scope.html(this.searchBoxContainerTemplate);
        this.searchMenu = $('.search-menu', scope);
        this.searchBox = $('.search-box', scope);
        this.searchInputBox = $('.search-input-box', scope);
        this.searchInput = $('.search-input', scope);
        this.messagemContainer = $('#messageContainer', scope)

        this.searchInputBox.dropdown();

        this.displayDefaultMenuKeys();
    }

    displayDefaultMenuKeys() {
        this.keys.forEach(function(item) {
            this.searchMenu.append(this.formatTemplate(item.label, this.menuItem));
        }, this);
    }

    addListenerToSearchKeys() {
        const menuSearchKeys = $('.menu-search-key');
        menuSearchKeys.off();
        menuSearchKeys.on('click', this, function(event){
            event.data.addKeyToSearchBox(event.target.dataset.key);
            event.data.searchInput.focus();
        });
    }

    addListenerToSearchItemDelete() {
        const searchItemDelete = $('.search-item-delete');
        searchItemDelete.off();
        searchItemDelete.on('click', this, function(event){
            const searchItemValue = $(event.target).parent().data('value');
            event.data.removeKeyValueFromSearchBoxByValue(searchItemValue);
        });
    }

    addListenerToSearchInput() {
        this.searchInput.on('keydown', this, this.handleInputKeyPress);
        this.searchInput.on('keyup', this, this.filterSearchMenuUsingInputValue);
        this.searchInput.on('focusout', this, this.checkIfNeedToCreateValueFromEvent);
        this.searchInput.on('focus', this, this.showSearchMenu);
    }

    checkIfNeedToCreateValueFromEvent(event) {
        event.data.checkIfNeedToCreateValueFromInput();
    }

    showSearchMenu(event) {
        setTimeout(function() {
            if (event.data.searchMenu.is(':hidden'))
                event.data.searchInputBox.dropdown('toggle');
        }, 150);
    }

    addKeyToSearchBox(key) {
        this.searchInput.val('');
        this.setValueMode();
        this.searchInputBox.before(this.formatTemplate(key, this.keyItem))
        this.updateSearchMenu();
    }

    updateSearchMenu() {
        let searchKeys = $('.search-key');
        let usedKeys = searchKeys.map( (index, searchKey) => {
            return searchKey.dataset.key;
        }).toArray();
        let keysToDisplay = this.keys.filter(key => !usedKeys.includes(key.label));
        this.searchMenu.children().remove();
        keysToDisplay.forEach(function(item) {
            this.searchMenu.append(this.formatTemplate(item.label, this.menuItem));
            this.addListenerToSearchKeys();
        }, this);
    }

    setValueMode() {
        this.searchInput.data('value-mode', true);
        this.searchInputBox.dropdown('update')
        if (this.searchMenu.is(':visible'))
            this.searchInputBox.dropdown('toggle')

        this.searchInputBox.addClass('disabled');
    }

    setKeyMode() {
        this.searchInput.data('value-mode', false);
        this.searchInputBox.removeClass('disabled');
        this.searchInputBox.dropdown('update')
        if (this.searchMenu.is(':hidden'))
            this.searchInputBox.dropdown('toggle')
    }

    handleInputKeyPress(event) {
        let inputValue = event.target.value;
        let key = event.key;
        if (inputValue.length === 0 && key === 'Backspace')
            event.data.removeLastKeyFromSearchBox();
        
        if (inputValue.length === 0 && key === 'Enter')
            event.data.sendData();
        
            const isValueMode = event.data.searchInput.data('value-mode');
        if (isValueMode) {
            if (key === 'Enter') {
                event.data.createSearchValueFromInput();
                event.data.searchInput.val('');
            }
        }
    }

    removeLastKeyFromSearchBox() {
        let searchItens = $('.search-item');
        if (searchItens.length > 0) {
            let lastKey = searchItens.last();
            if (lastKey.hasClass('search-key'))
                this.setKeyMode();
            else
                this.setValueMode();
            
            searchItens.last().remove();
            this.updateSearchMenu();
        }
    }

    removeKeyValueFromSearchBoxByValue(value) {
        let searchItens = $('.search-item');
        if (searchItens.length > 0) {
            const valueItemToRemove = $(searchItens.filter('[data-value="'+ value + '"]')[0]);
            const keyItemToRemove = valueItemToRemove.prev();

            valueItemToRemove.remove();
            keyItemToRemove.remove();
            this.updateSearchMenu();
        }
    }

    createSearchValueFromInput() {
        let inputValue = this.searchInput.val();
        this.addValueToSearchBox(inputValue);
    }

    addValueToSearchBox(value) {
        this.searchInputBox.before(this.formatTemplate(value, this.valueItem));
        this.searchInput.val('');
        this.addListenerToSearchItemDelete();
        this.setKeyMode();
    }

    filterSearchMenuUsingInputValue(event) {
        if (!event.data.searchInput.data('value-mode')) {
            let inputValue = event.target.value.trim();
            let keysThatDontMatchInput = event.data.keys
                .filter(value => !value.label.toUpperCase().includes(inputValue.toUpperCase()))
                .map( key => key.label);
            $('.menu-search-key').each((index, menuSearchKey) => {
                if (keysThatDontMatchInput.includes(menuSearchKey.dataset.key))
                    $(menuSearchKey).hide();
                else
                    $(menuSearchKey).show();
            })
        }
    }

    sendData() {
        this.checkIfNeedToCreateValueFromInput();
        let keyValues = this.searchBox.children().map( (index, searchKey) => {
            return 'key' in searchKey.dataset ? searchKey.dataset.key : searchKey.dataset.value;
        }).toArray();

        let form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', this.action);

        let inputId = '';
        let inputValue = '';
        keyValues.forEach( (item, index) => {
                if(this.isKey(index))
                    inputId = this.getIdFromLabel(item);
                else
                    inputValue = item;
                
                if (inputId !== '' && inputValue !== '') {
                    this.createFormInput(inputId, inputValue, form);
                    inputId = '';
                    inputValue = '';
                }
                
        })

        if (this.aditionalInput !== undefined) {
            if (this.aditionalInput.key === undefined || this.aditionalInput.value === undefined)
                throw "Invalid aditionalFormInput on sendDataMethod. Example of valid aditionalFormInput: {key: 'myKey', value: 'myValue'}";
            this.createFormInput(this.aditionalInput.key, this.aditionalInput.value, form);
        }

        document.getElementsByTagName('body')[0].appendChild(form);
        form.submit();
    }

    getIdFromLabel(label) {
        return this.keys.filter(key => key.label === label)[0].id;
    }

    checkIfNeedToCreateValueFromInput() {
        let isValueMode = this.searchInput.data('value-mode');
        if (isValueMode) {
            this.createSearchValueFromInput();
            this.searchInput.val('');
        }
    }
    
    isKey(index) {
        return index % 2 === 0;
    }

    createFormInput(inputId, inputValue, form) {
        let input = document.createElement("input");
        input.setAttribute('type',"hidden");
        input.setAttribute('id',inputId);
        input.setAttribute('name',inputId);
        input.setAttribute('value',inputValue);

        form.appendChild(input);
    }

    loadFromObject(objectToLoad) {
        Object.entries(objectToLoad).forEach(entry => this.addSearchKeyAndValueFromEntry(entry));
        if (this.searchMenu.is(':visible'))
            this.searchInputBox.dropdown('toggle')
    }

    addSearchKeyAndValueFromEntry(entry) {
        let value = entry[1];
        if (value !== null && value !== undefined) {
            let id = entry[0];
            let keyLabel = this.getLabelFromId(id);
            this.addKeyToSearchBox(keyLabel);
            this.addValueToSearchBox(value);
        }
    }

    getLabelFromId(id) {
        return this.keys.filter(key => key.id === id)[0].label;
    }

    displayError(errorMessage) {
        this.formatSearchBoxToDisplayError();
        this.messagemContainer.text(errorMessage);
        this.messagemContainer.show();
    }

    formatSearchBoxToDisplayError() {
        this.searchBox.addClass('border-danger rounded');
        this.searchBox.removeClass('mb-3')
    }
}