require(['md-highlight'], function (highlighter) {

    highlighter.highlight('# Title\n\nThis is an `example`.');

    // This will output something like
    // <span class="md-heading md-heading-1"># Title</span>\n\nThis is an <span class="md-icode">`example`</span>
});
