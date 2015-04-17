require("./stylesheets/main.less");
var tagTemplate = require("./templates/tag.html");
var settings = require("./settings");

var Q = codebox.require("q");
var _ = codebox.require("hr.utils");
var commands = codebox.require("core/commands");
var rpc = codebox.require("core/rpc");
var dialogs = codebox.require("utils/dialogs");

var tags = undefined;

function updateTags() {
    return codebox.statusbar.loading(
        rpc.execute("ctags/list"),
        {
            prefix: "Updating ctags"
        }
    )
    .then(function(_tags) {
        tags = _tags;
        return tags;
    });
}

function getTags() {
    if (tags !== undefined) return Q(tags);
    return updateTags();
}

// Command to update list of tags
commands.register({
    id: "ctags.update",
    title: "Ctags: Update",
    shortcuts: [],
    run: function() {
        return updateTags();
    }
});

// Command to search for a tag
commands.register({
    id: "ctags.search",
    title: "Ctags: Jump to Tag",
    shortcuts: [],
    run: function() {
        return getTags()
        .then(function() {
            return dialogs.list(tags, {
                template: tagTemplate,
                placeholder: "Jump to tag"
            });
        })
        .then(function(tag) {
            return commands.run("file.open", {
                'path': tag.get("file"),
                'line': 10
            });
        });
    }
});

// CTAGS Autocomplete in the editor
codebox.editor.autocomplete.add(function(editor, pos, prefix) {
    if (!settings.data.get("autocompletion")) return [];

    prefix = prefix.toLowerCase();

    return getTags()
    .then(function(_tags) {
        return _.chain(_tags)
        .filter(function(tag) {
            return tag.name.toLowerCase().search(prefix) >= 0;
        })
        .map(function(tag) {
            return {
                'name': tag.name,
                'value': tag.name,
                'score': 0,
                'meta': tag.kind || ""
            };
        })
        .value();
    });
});


// Menu
if (codebox.menubar) {
    codebox.menubar.createMenu("tools", {
        caption: "Tags",
        items: [
            {
                caption: "Jump to...",
                command: "ctags.search"
            },
            {
                caption: "Update List",
                command: "ctags.update"
            }
        ]
    })
}

