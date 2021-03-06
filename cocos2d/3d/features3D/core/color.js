cc3d.extend(cc3d, (function () {
    var Color = function () {
        this.buffer = new ArrayBuffer(4 * 4);

        this.data = new Float32Array(this.buffer, 0, 4);
        this.data3 = new Float32Array(this.buffer, 0, 3);

        if (arguments.length >= 3) {
            this.data[0] = arguments[0];
            this.data[1] = arguments[1];
            this.data[2] = arguments[2];
            this.data[3] = (arguments.length >= 4) ? arguments[3] : 1;
        } else {
            this.data[0] = 0;
            this.data[1] = 0;
            this.data[2] = 0;
            this.data[3] = 1;
        }
    };

    Color.prototype = {
        clone: function () {
            return new cc3d.Color(this.data[0], this.data[1], this.data[2], this.data[3]);
        },

        copy: function (rhs) {
            var a = this.data,
                b = rhs.data;

            a[0] = b[0];
            a[1] = b[1];
            a[2] = b[2];
            a[3] = b[3];

            return this;
        },

        set: function (r, g, b, a) {
            var c = this.data;

            c[0] = r;
            c[1] = g;
            c[2] = b;
            c[3] = (a === undefined) ? 1 : a;

            return this;
        },

        fromString: function (hex) {
            var i = parseInt(hex.replace('#', '0x'));
            var bytes;
            if (hex.length > 7) {
                bytes = cc3d.math.intToBytes32(i);
            } else {
                bytes = cc3d.math.intToBytes24(i);
                bytes[3] = 255;
            }

            this.set(bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, bytes[3] / 255);

            return this;
        },

        toString: function (alpha) {
            var s = "#" + ((1 << 24) + (parseInt(this.r * 255) << 16) + (parseInt(this.g * 255) << 8) + parseInt(this.b * 255)).toString(16).slice(1);
            if (alpha === true) {
                var a = parseInt(this.a * 255).toString(16);
                if (this.a < 16 / 255) {
                    s += '0' + a;
                } else {
                    s += a;
                }

            }

            return s;
        }
    };

    Object.defineProperty(Color.prototype, 'r', {
        get: function () {
            return this.data[0];
        },
        set: function (value) {
            this.data[0] = value;
        }
    });

    Object.defineProperty(Color.prototype, 'g', {
        get: function () {
            return this.data[1];
        },
        set: function (value) {
            this.data[1] = value;
        }
    });

    Object.defineProperty(Color.prototype, 'b', {
        get: function () {
            return this.data[2];
        },
        set: function (value) {
            this.data[2] = value;
        }
    });

    Object.defineProperty(Color.prototype, 'a', {
        get: function () {
            return this.data[3];
        },
        set: function (value) {
            this.data[3] = value;
        }
    });

    return {
        Color: Color
    };
}()));
