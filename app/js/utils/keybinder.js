import keyboardJS from 'keyboardjs';

var keybinder = {
    context: null,

    setContext: function(context) {
        this.context = context;
        keyboardJS.setContext(context);
    },

    setContextWithBindings: function(context, bindings) {
        keyboardJS.withContext(context, function() {
            bindings.forEach((item) => {
                keyboardJS.unbind(item.keyCombo); // ensuring that we have a clean context (no duplicates)
                keyboardJS.bind(item.keyCombo, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    item.fn(e);
                });
            });
        });
    }
};

export default keybinder;
