var et = require('elementtree');
var inflect = require('inflect');

var ElementTree = et.ElementTree;
var element = et.Element;
var subElement = et.SubElement;

/**
 * This function merges two objects. Pretty simple stuff.
 */
function merge(obj1, obj2) {
    var obj3 = {};
    for (var attr1 in obj1) {
        obj3[attr1] = obj1[attr1];
    }
    for (var attr2 in obj2) {
        obj3[attr2] = obj2[attr2];
    }
    return obj3;
}

/**
 * This function pads a number so that it is two digits
 */
function zeroPadTen(val) {
    if (val < 10) {
        return "0" + val;
    }
    return val;
}

/**
 * This is our main EasyXml object which gets exported as a module
 */
var EasyXml = function() {
    var self = this;

    /**
     * Default configuration object
     */
    self.config = {
        singularizeChildren: true,
        underscoreAttributes: true,
        underscoreChar: '_',
        rootElement: 'response',
        dateFormat: 'ISO', // ISO = ISO8601, SQL = MySQL Timestamp, JS = (new Date).toString()
        manifest: false,
        unwrappedArrays:false,
        indent: 4,
        filterNulls:false
    };

    /**
     * Public
     * Merges in the provided config object with the defaults
     */
    self.configure = function(config) {
        // should be merge, otherwise we lose defaults
        self.config = merge(self.config, config);
    };

    /**
     * Public
     * Takes an object and returns an XML string
     */
    self.render = function(object, rootElementOverride) {
        var xml = element(rootElementOverride || self.config.rootElement);

        parseChildElement(xml, object);

        return new ElementTree(xml).write({
            xml_declaration: self.config.manifest,
            indent: self.config.indent
        });
    };

    var isFilterNulls = function(child) {
        return self.config.filterNulls === true;
    };
    /**
     * Recursive, Private
     * Takes an object and attaches it to the XML doc
     */
    function parseChildElement(parentXmlNode, parentObjectNode) {
        for (var key in parentObjectNode) {
            if (parentObjectNode.hasOwnProperty(key)) {
                var isAttribute = function(self) {
                    return (self.config.underscoreAttributes && key.charAt(0) === self.config.underscoreChar);
                };
                var isChildKeyParsed = function(child) {
                    switch(typeof child) {
                    case 'number':
                    case 'string':
                    case 'boolean':
                        return false;
                    default:
                        // null, undefined, objects, functions
                        return true;
                    }
                }
                     
                var child = parentObjectNode[key];
                var el = null;

                if ( child == null && isFilterNulls()) {
                    // no element if we are skipping nulls and undefined
                    continue;
                }
                if (!isAttribute(self))
                    el = subElement(parentXmlNode, key);

                if (child == null) {
                    // allow for both null child and undefined child
                    el.text = ""
                } else if (!self.config.singularizeChildren && typeof parentXmlNode === 'object' && typeof child === 'object') {
                    for (var key in child) {
                        if (isChildKeyParsed(child[key])) {
                            parseChildElement(el, child[key]);
                        } else {
                            el = subElement(el, key);
                            el.text = child[key].toString();
                        }
                    }
                } else if (isAttribute(self)) {
                    if (typeof child === 'string' || typeof child === 'number') {
                        if(key === self.config.underscoreChar)
                          parentXmlNode.text=child;
                        else
                          parentXmlNode.set(key.substring(1), child);
                    } else {
                        throw new Error(key + "contained non_string_attribute");
                    }
                } else if (typeof child === 'object' && child.constructor && child.constructor.name && child.constructor.name === 'Date') {
                    // Date
                    if (self.config.dateFormat === 'ISO') {
                        // ISO: YYYY-MM-DDTHH:MM:SS.mmmZ
                        el.text = child.toISOString();
                    } else if (self.config.dateFormat === 'SQL') {
                        // SQL: YYYY-MM-DD HH:MM:SS
                        var yyyy    = child.getFullYear();
                        var mm      = zeroPadTen(child.getMonth() + 1);
                        var dd      = zeroPadTen(child.getDate());
                        var hh      = zeroPadTen(child.getHours());
                        var min     = zeroPadTen(child.getMinutes());
                        var ss      = zeroPadTen(child.getSeconds());

                        el.text = [yyyy, '-', mm, '-', dd, ' ', hh, ':', min, ':', ss].join("");
                    } else if (self.config.dateFormat === 'JS') {
                        // JavaScript date format
                        el.text = child.toString();
                    } else {
                        throw new Error(key + "contained unknown_date_format");
                    }
                } else if (typeof child === 'object' && child.constructor && child.constructor.name && child.constructor.name === 'Array') {
                    // Array
                    var subElementName = inflect.singularize(key);

                    for (var key2 in child) {
                        if ( child[key2] == null && isFilterNulls()) {
                            continue;
                        }
                        // if unwrapped arrays, make new subelements on the parent.
                        var el2 = (self.config.unwrappedArrays === true) ? ((el) || subElement(parentXmlNode, key)) : (subElement(el, subElementName));
                        // Check type of child element
                        if (child.hasOwnProperty(key2) && isChildKeyParsed(child[key2])) {
                            parseChildElement(el2, child[key2]);
                        } else {
                            // Just add element directly without parsing
                            el2.text = child[key2].toString();
                        }
                        // if unwrapped arrays, the initial child element has been consumed:
                        if (self.config.unwrappedArrays === true) el = undefined;
                    }
                } else if (typeof child === 'object') {
                    // Object, go deeper
                    parseChildElement(el, child);
                } else if (typeof child === 'number' || typeof child === 'boolean') {
                    el.text = child.toString();
                } else if (typeof child === 'string') {
                    el.text = child;
                } else {
                    throw new Error(key + " contained unknown_data_type: " + typeof child);
                }
            }
        }
    }
};

module.exports = new EasyXml();
