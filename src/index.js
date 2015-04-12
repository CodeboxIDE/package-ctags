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

commands.register({
    id: "ctags.update",
    title: "Ctags: Update",
    shortcuts: [],
    run: function() {
        return updateTags();
    }
});

commands.register({
    id: "ctags.search",
    title: "Ctags: Search Tags",
    shortcuts: [],
    run: function() {
        return getTags()
        .then(function() {
            return dialogs.list(tags, {
                template: tagTemplate
            });
        })
        .then(function(tag) {

        });
    }
});
