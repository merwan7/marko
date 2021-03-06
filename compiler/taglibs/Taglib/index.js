/*
 * Copyright 2011 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var forEachEntry = require('raptor-util').forEachEntry;
var ok = require('assert').ok;

function Taglib(path) {
    ok(path, '"path" expected');
    this.path = path;
    this.dirname = null;
    this.tags = {};
    this.textTransformers = [];
    this.attributes = {};
    this.patternAttributes = [];
    this.inputFilesLookup = {};
    this.imports = null;
}

Taglib.prototype = {

    addInputFile: function(path) {
        this.inputFilesLookup[path] = true;
    },

    getInputFiles: function() {
        return Object.keys(this.inputFilesLookup);
    },

    addAttribute: function (attribute) {
        if (attribute.pattern) {
            this.patternAttributes.push(attribute);
        } else if (attribute.name) {
            this.attributes[attribute.name] = attribute;
        } else {
            throw new Error('Invalid attribute: ' + require('util').inspect(attribute));
        }
    },
    getAttribute: function (name) {
        var attribute = this.attributes[name];
        if (!attribute) {
            for (var i = 0, len = this.patternAttributes.length; i < len; i++) {
                var patternAttribute = this.patternAttributes[i];
                if (patternAttribute.pattern.test(name)) {
                    attribute = patternAttribute;
                }
            }
        }
        return attribute;
    },
    addTag: function (tag) {
        ok(arguments.length === 1, 'Invalid args');
        ok(tag.name, '"tag.name" is required');
        this.tags[tag.name] = tag;
        tag.taglibId = this.id;
    },
    addTextTransformer: function (transformer) {
        this.textTransformers.push(transformer);
    },
    forEachTag: function (callback, thisObj) {
        forEachEntry(this.tags, function (key, tag) {
            callback.call(thisObj, tag);
        }, this);
    },

    addImport: function(path) {
        if (!this.imports) {
            this.imports = [];
        }
        this.imports.push(path);
    }
};

Taglib.Tag = require('./Tag');
Taglib.Attribute = require('./Attribute');
Taglib.Property = require('./Property');
Taglib.NestedVariable = require('./NestedVariable');
Taglib.ImportedVariable = require('./ImportedVariable');
Taglib.Transformer = require('./Transformer');

module.exports = Taglib;