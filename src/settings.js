module.exports = codebox.settings.schema("ctags",
    {
        "title": "Ctags",
        "type": "object",
        "properties": {
            "autocompletion": {
                "title": "Enable ctags for autocompletions",
                "type": "boolean",
                "default": true
            }
        }
    }
);
