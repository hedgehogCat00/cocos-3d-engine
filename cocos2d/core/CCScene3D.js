/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var NIL = function () {};

/**
 * !#en
 * cc.Scene3D is a subclass of cc.Node that is used only as an abstract concept.<br/>
 * cc.Scene3D and cc.Node are almost identical with the difference that users can not modify cc.Scene3D manually.
 * !#zh
 * cc.Scene3D 是 cc.Node 的子类，仅作为一个抽象的概念。<br/>
 * cc.Scene3D 和 cc.Node 有点不同，用户不应直接修改 cc.Scene3D。
 * @class Scene
 * @extends _BaseNode
 */
cc.Scene3D = cc.Class({
    name: 'cc.Scene3D',
    extends: require('./CCNode3D'),

    properties: {

        /**
         * !#en Indicates whether all (directly or indirectly) static referenced assets of this scene are releasable by default after scene unloading.
         * !#zh 指示该场景中直接或间接静态引用到的所有资源是否默认在场景切换后自动释放。
         * @property {Boolean} autoReleaseAssets
         * @default false
         */
        autoReleaseAssets: undefined,

    },

    ctor: function () {
        this._sgScene = new cc3d.Scene();
        this._testCode();
        this._activeInHierarchy = false;
        this._inited = !cc.game._isCloning;

        // cache all depend assets for auto release
        this.dependAssets = null;
    },

    //todo: test forward renderer remove it later
    _testCode: function() {
        var camera = this._testCamera = new cc3d.Camera();
        camera._node = this;
        camera.setClearOptions({
            color: [186.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 1.0],
            depth: 1.0,
            stencil: 0,
            flags: cc3d.CLEARFLAG_COLOR | cc3d.CLEARFLAG_DEPTH | cc3d.CLEARFLAG_STENCIL
        });

    },

    destroy: function () {
        var children = this._children;
        var DontDestroy = cc.Object.Flags.DontDestroy;

        for (var i = 0, len = children.length; i < len; ++i) {
            var child = children[i];
            if (child.isValid) {
                if (!(child._objFlags & DontDestroy)) {
                    child.destroy();
                }
            }
        }

        this._super();
        this._activeInHierarchy = false;
    },

    _onHierarchyChanged: NIL,
    _instantiate : null,

    _load: function () {
        if ( ! this._inited) {


            // deactivate EventManager by default
            //cc.eventManager.pauseTarget(this);

            var children = this._children;
            for (var i = 0, len = children.length; i < len; i++) {
                children[i]._onBatchCreated();
            }

            this._inited = true;
        }
    },

    _activate: function (active) {
        active = (active !== false);
        var i, child, children = this._children, len = children.length;

        if (CC_EDITOR || CC_TEST) {
            // register all nodes to editor
            for (i = 0; i < len; ++i) {
                child = children[i];
                child._registerIfAttached(active);
            }
        }

        this._activeInHierarchy = active;

        // invoke onLoad and onEnable
        for (i = 0; i < len; ++i) {
            child = children[i];
            if (child._active) {
                child._onActivatedInHierarchy(active);
            }
        }
    }
});

module.exports = cc.Scene3D;
