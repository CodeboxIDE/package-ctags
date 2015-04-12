var _ = require('lodash');

var tags = require('./tags');

module.exports = function(codebox) {
    var workspace = codebox.workspace;
    var workspaceRoot = codebox.workspace.root();
    var events = codebox.events;
    var project = codebox.rpc.get("project");

    codebox.rpc.service("ctags", {
        list: function() {
            return project.files()
            .then(function(files) {
                return tags.get(workspaceRoot, files);
            });
        }
    });
};
