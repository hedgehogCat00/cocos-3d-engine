cc3d.extend(cc3d, function () {
    'use strict';

    var ScopeSpace = function (name) {
        // Store the name
        this.name = name;

        // Create the empty tables
        this.variables = {};
        this.namespaces = {};
    };

    ScopeSpace.prototype = {
        resolve: function (name) {
            // Check if the ScopeId already exists
            if (this.variables.hasOwnProperty(name) === false) {

                // Create and add to the table
                this.variables[name] = new cc3d.ScopeId(name);
            }

            // Now return the ScopeId instance
            return this.variables[name];
        },

        getSubSpace: function (name) {
            // Check if the nested namespace already exists
            if (this.namespaces.hasOwnProperty(name) === false) {

                // Create and add to the table
                this.namespaces[name] = new cc3d.ScopeSpace(name);

                logDEBUG("Added ScopeSpace: " + name);
            }

            // Now return the ScopeNamespace instance
            return this.namespaces[name];
        }
    };

    return {
        ScopeSpace: ScopeSpace
    };
}());
