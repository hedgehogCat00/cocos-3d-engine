cc3d.extend(cc3d, function () {
    return {
        /**
         * @private
         * @function
         * @name cc3d.createURI
         * @description Create a URI object from constiuent parts
         * @param {Object} options Parts of the URI to build
         * @param {String} [options.scheme] The URI scheme (e.g. http)
         * @param {String} [options.authority] The URI authority (e.g. www.example.com)
         * @param {String} [options.host] Combination of scheme and authority (e.g. http://www.example.com)
         * @param {String} [options.path] The URI path (e.g. /users/example)
         * @param {String} [options.hostpath] Combination of scheme, authority and path (e.g. http://www.example.com/users/example)
         * @param {String} [options.query] The query section, after the ?(e.g. http://example.com?<b>key=value&another=123</b>)
         * @param {String} [options.fragment] The fragment section, after the # (e.g. http://example.com#<b>fragment/data</b>)
         * @returns {String} A URI string
         */
        createURI: function (options) {
            var s = "";
            if ((options.authority || options.scheme) && (options.host || options.hostpath)) {
                throw new Error("Can't have 'scheme' or 'authority' and 'host' or 'hostpath' option");
            }
            if (options.host && options.hostpath) {
                throw new Error("Can't have 'host' and 'hostpath' option");
            }
            if (options.path && options.hostpath) {
                throw new Error("Can't have 'path' and 'hostpath' option");
            }

            if (options.scheme) {
                s += options.scheme + ":";
            }

            if (options.authority) {
                s += "//" + options.authority;
            }

            if (options.host) {
                s += options.host;
            }

            if (options.path) {
                s += options.path;
            }

            if (options.hostpath) {
                s += options.hostpath;
            }

            if (options.query) {
                s += "?" + options.query;
            }

            if (options.fragment) {
                s += "#" + options.fragment;
            }

            return s;
        },

        /**
         * @private
         * @name cc3d.URI
         * @description Create a new URI object
         * @class A URI object
         * @param {String} uri URI string
         */
        URI: function (uri) {
            // See http://tools.ietf.org/html/rfc2396#appendix-B for details of RegExp
            var re = /^(([^:\/?\#]+):)?(\/\/([^\/?\#]*))?([^?\#]*)(\?([^\#]*))?(\#(.*))?/,
                result = uri.match(re);

            /**
             * @name cc3d.URI#scheme
             * @description The scheme. (e.g. http)
             */
            this.scheme = result[2];

            /**
             * @name cc3d.URI#authority
             * @description The authority. (e.g. www.example.com)
             */
            this.authority = result[4];

            /**
             * @name cc3d.URI#path
             * @description The path. (e.g. /users/example)
             */
            this.path = result[5];

            /**
             * @name cc3d.URI#query
             * @description The query, the section after a ?. (e.g. search=value)
             */
            this.query = result[7];

            /**
             * @name cc3d.URI#fragment
             * @description The fragment, the section after a #
             */
            this.fragment = result[9];

            /**
             * @function
             * @name cc3d.URI#toString
             * @description Convert URI back to string
             */
            this.toString = function () {
                var s = "";

                if (this.scheme) {
                    s += this.scheme + ":";
                }

                if (this.authority) {
                    s += "//" + this.authority;
                }

                s += this.path;

                if (this.query) {
                    s += "?" + this.query;
                }

                if (this.fragment) {
                    s += "#" + this.fragment;
                }

                return s;
            };

            /**
             * @function
             * @name cc3d.URI#getQuery
             * @description Returns the query parameters as an Object
             * @example
             * <code><pre lang="javascript">
             * var s = "http://example.com?a=1&b=2&c=3
             * var uri = new cc3d.URI(s);
             * var q = uri.getQuery();
             * console.log(q.a); // logs "1"
             * console.log(q.b); // logs "2"
             * console.log(q.c); // logs "3"
             * </code></pre>
             */
            this.getQuery = function () {
                var vars;
                var pair;
                var result = {};

                if (this.query) {
                    vars = decodeURIComponent(this.query).split("&");
                    vars.forEach(function (item, index, arr) {
                        pair = item.split("=");
                        result[pair[0]] = pair[1];
                    }, this);
                }

                return result;
            };

            /**
             * @function
             * @name cc3d.URI#setQuery
             * @description Set the query section of the URI from a Object
             * @param {Object} params Key-Value pairs to encode into the query string
             * @example
             * var s = "http://example.com";
             * var uri = new cc3d.URI(s);
             * uri.setQuery({"a":1,"b":2});
             * console.log(uri.toString()); // logs "http://example.com?a=1&b=2
             */
            this.setQuery = function (params) {
                var q = "";
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        if (q !== "") {
                            q += "&";
                        }
                        q += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
                    }
                }

                this.query = q;
            };
        }
    };
}());
