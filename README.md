# OmnInput.js

## What's OmnInput.js (Omni Input)
OmnInput is a UI component that replaces long HTML forms, with many inputs, putting everything together in just one input bar with filter and tokenization.

> 🚨 Importants Notes
> - **OmnInput.js depends on [Bootstrap](https://github.com/twbs/bootstrap) and [jQuery](https://github.com/jquery/jquery), so you must add these dependencies to your project**


## Table of Contents

- [Usage](#usage)
- [Contributing](#contributing)
- [Example](https://github.com/mizerablebr/omnInput/blob/master/omniInput-example.html)
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