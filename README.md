# OmnInput.js

## What's OmnInput.js (Omni Input)
OmnInput is a UI component that replaces long HTML forms, putting everything together in just one input bar with filter and tokenization.

OmnInput.js allow you to replace this:

![Form without OmnInput](https://raw.githubusercontent.com/mizerablebr/omnInput/master/examples/assets/formWithoutOmnInput.png)

with this:

![Form with OmnInput](https://raw.githubusercontent.com/mizerablebr/omnInput/master/examples/assets/formWithOmnInput.png)


>Check out our [Live Preview](https://codepen.io/brunomiz/full/jOmYjaO)


## Table of Contents

- [OmnInput.js](#omninputjs)
  - [What's OmnInput.js (Omni Input)](#whats-omninputjs-omni-input)
  - [Live Preview](https://codepen.io/brunomiz/full/jOmYjaO)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

##  Usage

```javascript
<script>
        $(document).ready(function() {
            const keys = [{label: 'Plate', id: 'plate'}, ...];
            const componentId = 'omnInputContainer';
            const postUrl =  '/post';

            var omnInput = OmnInput.create(keys, componentId, postUrl);
                        
            $('#sendButton').click(function() {omnInput.sendData()});
        });
</script>
```

> 🚨 Important Notes
> - **OmnInput.js depends on [Bootstrap](https://github.com/twbs/bootstrap) and [jQuery](https://github.com/jquery/jquery), so you must add these dependencies to your project**

Check out our [example](https://github.com/mizerablebr/omnInput/blob/master/omniInput-example.html) for more information like installation, or how to add additional Form Input and display error messages.

### Using

For each provided Key (which consists of an object with `label` and `id` property), OmnInput will display to the user the Key Menu using the `label` property.

When the user clicks the OmnInput or when it receives focus, the available keys are displayed. As the user types some text, the available keys are filtered to just those that match the provided text. The user can choose those using the keyboard or the mouse.

After choosing a key, the OmnInput starts the **Value Mode**, when the user can freely type any value. To tokenize this value and proceed to add a new key/value pair, the user can press the Enter key.

With the execution of the function `sendData()`, which can be attached to a button or any other Element, the OmnInput creates an HTML Form and submit it to the provided Post URL. For each key/value pair, it'll create a form input using the `id` propriety from the Key.

## Contributing

First, thank you for your contribution. If you want to contribute, feel free to search for [open issues](../../issues) or our [project roadmap](../../projects/1), we have a lot of work to do, and of course we'll need you.

1. Fork the repository to send PRs

2. Clone your fork, use SSH if possible (`git clone git@github.com:<your-username>/omnInput.git`). Read more about it over [here](https://help.github.com/articles/connecting-to-github-with-ssh/).

3. `cd` into the project directory

4. Checkout the `master` branch (should be the default)

5. Create a new branch for the new feature: `git checkout -b new-feature`

6. Make your changes and commit it: `git add . && git commit -am "Add new feature"`

7. Push to the branch: `git push origin new-feature`

8. Submit a pull request with full remarks documenting your changes.

> 🚨 Important Notes
> - **We are in an effort to use TDD and Clean Code, so despite the first version code, we ask all contributors to adopt TDD and Clean Code Discipline in the new features.**

### Testing

There is a small testing framework in the `test` folder. All static functions in the `test.js` will be executed as test functions when you open the `runtests.html` on your browser.

Exemple:
```javascript
static givenClickEventOnSomeThingThenExecuteThatThing() {
        // Preparation
        const isOk = false;
        OmnInputTests.omnInput.status = isOk;
        
        // Action
        OmnInputTests.omnInput.toggleStatus();
        
        // Assertion
        return assertTRue(OmnInputTests.omnInput.status);
    }
```


## License

[MIT License](LICENSE) © OmnInput.js