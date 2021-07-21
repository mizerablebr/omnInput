class SearchBox {
    constructor(keys, containerId, action) {
        this.keys = keys;
        this.containerId = containerId;
        this.action = action;
        this.searchMenu = {};
        this.searchBox = {};
        this.searchInputBox = {};
        this.searchInput = {};
        this.searchBoxContainerTemplate = '<div class="search-box border m-3 p-2 d-flex bg-white"><div class="search-input-box d-flex flex-grow-1" data-toggle="dropdown"><input class="search-input flex-grow-1 text-uppercase" data-value-mode="false" type="text" style="border: 0; outline:0;"/></div><div class="search-menu dropdown-menu mt-3" aria-labelledby="dropdownMenuButton"></div></div>'
        this.keyItem = '<div class="search-item search-key px-1 mr-1 text-uppercase" data-key="{}" style="color: #707070; background-color: #dbdbdb; padding-top: .20rem;"><span>{}</span>:</div>'
        this.valueItem = '<div class="search-item search-value px-1 mr-2 text-uppercase" data-value="{}" style="background-color: #dbdbdb; padding-top: .20rem;">{}</div>'
        this.menuItem = '<a class="menu-search-key dropdown-item" data-key="{}" href="#">{}</a>';
        this.containerId = 'searchBoxContainer';

        this.initialSetup();

        this.addListenerToSearchKeys();
        this.addListenerToSearchInput();
    }

    aditionalFormInput(aditionalInput) {
        this.aditionalInput = aditionalInput;
        return this;
    }

    static create(keys, containerId) {
        if (!Array.isArray(keys) || keys[0].label === undefined || keys[0].id === undefined)
            throw "Each item from the Array Keys must be a Object containing Label and Id. Ex.: {label: 'My Label', id: 'myId'}"
        return new SearchBox(keys, containerId);
    }

    formatTemplate(term, template) {
        return template.replace(/\{\}/g, term);
    }
    

    initialSetup() {
        $('#' + this.containerId).html(this.searchBoxContainerTemplate);
        this.searchMenu = $('.search-menu');
        this.searchBox = $('.search-box');
        this.searchInputBox = $('.search-input-box');
        this.searchInput = $('.search-input');

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

    addListenerToSearchInput() {
        this.searchInput.on('keydown', this, this.handleInputKeyPress);
        this.searchInput.on('keyup', this, this.filterSearchMenuUsingInputValue);
        this.searchInput.on('focusout', this, this.checkIfNeedToCreateValueFromEvent);
    }

    checkIfNeedToCreateValueFromEvent(event) {
        event.data.checkIfNeedToCreateValueFromInput();
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
        this.searchInputBox.attr('data-toggle', '');
        this.searchMenu.dropdown('update')
        this.searchMenu.hide();
    }

    setKeyMode() {
        this.searchInput.data('value-mode', false);
        this.searchInputBox.attr('data-toggle', 'dropdown');
        this.searchInputBox.data('toggle', 'dropdown');
        this.searchMenu.dropdown('update')
        this.searchMenu.show();
    }

    handleInputKeyPress(event) {
        let inputValue = event.target.value;
        let key = event.key;
        if (inputValue.length === 0 && key === 'Backspace')
            event.data.removeLastKeyFromSearchBox();
        
        if (inputValue.length === 0 && key === 'Enter')
            event.data.sendData();

        if (event.data.searchInput.data('value-mode')) {

            if (key === ' ' || key == 'Enter') {
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

    createSearchValueFromInput() {
        let inputValue = this.searchInput.val();
        this.addValueToSearchBox(inputValue);
    }

    addValueToSearchBox(value) {
        this.searchInputBox.before(this.formatTemplate(value, this.valueItem));
        this.searchInput.val('');
        this.setKeyMode();
    }

    filterSearchMenuUsingInputValue(event) {
        if (!event.data.searchInput.data('value-mode')) {
            let inputValue = event.target.value.trim();
            let keysThatDontMatchInput = event.data.keys.filter(value => !value.label.toUpperCase().includes(inputValue.toUpperCase()));
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
        console.log('send data');
        let keyValues = this.searchBox.children().map( (index, searchKey) => {
            return 'key' in searchKey.dataset ? searchKey.dataset.key : searchKey.dataset.value;
        }).toArray();

        let form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', '/post');

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
        console.log(keyValues);
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
}