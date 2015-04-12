require("./stylesheets/main.less");
var tagTemplate = require("./templates/tag.html");

var Q = codebox.require("q");
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
                'path': tag.get("file")
            });
        });
    }
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
