# OmnInput.js

## What's OmnInput.js (Omni Input)
OmnInput is a UI component that replaces long HTML forms, with many inputs, putting everything together in just one input bar with filter and tokenization.

> 🚨 Importants Notes
> - **OmnInput.js depends on [Bootstrap](https://github.com/twbs/bootstrap) and [jQuery](https://github.com/jquery/jquery), so you must add these dependencies to your project**


## Table of Contents

- [OmnInput.js](#omninputjs)
  - [What's OmnInput.js (Omni Input)](#whats-omninputjs-omni-input)
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

Check out our [example](https://github.com/mizerablebr/omnInput/blob/master/omniInput-example.html) for more information like how to add additional Form Input and display error messages.

## Contributing

First of all, thank you for your contribution. If you want to contribute, feel free to search for [open issues](../../issues) or our [project roadmap](../..//projects/1), we have a lot of work to do, and of course we'll need you.

1. Fork the repository in order to send PRs

2. Clone your fork, use SSH if possible (`git clone git@github.com:<your-username>/omnInput.git`). Read more about it over [here](https://help.github.com/articles/connecting-to-github-with-ssh/).

3. `cd` into the project directory

4. Checkout the `master` branch (should be default)

5. Create a new branch for the new feature: `git checkout -b new-feature`

6. Make your changes and commit it: `git add . && git commit -am "Add new feature"`

7. Push to the branch: `git push origin new-feature`

8. Submit a pull request with full remarks documenting your changes.


## License

[MIT License](LICENSE.md) © OmnInput.js