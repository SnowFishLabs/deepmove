"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/js-beautify/js/src/core/output.js
var require_output = __commonJS({
  "node_modules/js-beautify/js/src/core/output.js"(exports2, module2) {
    "use strict";
    function OutputLine(parent) {
      this.__parent = parent;
      this.__character_count = 0;
      this.__indent_count = -1;
      this.__alignment_count = 0;
      this.__wrap_point_index = 0;
      this.__wrap_point_character_count = 0;
      this.__wrap_point_indent_count = -1;
      this.__wrap_point_alignment_count = 0;
      this.__items = [];
    }
    OutputLine.prototype.clone_empty = function() {
      var line = new OutputLine(this.__parent);
      line.set_indent(this.__indent_count, this.__alignment_count);
      return line;
    };
    OutputLine.prototype.item = function(index) {
      if (index < 0) {
        return this.__items[this.__items.length + index];
      } else {
        return this.__items[index];
      }
    };
    OutputLine.prototype.has_match = function(pattern) {
      for (var lastCheckedOutput = this.__items.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
        if (this.__items[lastCheckedOutput].match(pattern)) {
          return true;
        }
      }
      return false;
    };
    OutputLine.prototype.set_indent = function(indent, alignment) {
      if (this.is_empty()) {
        this.__indent_count = indent || 0;
        this.__alignment_count = alignment || 0;
        this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count);
      }
    };
    OutputLine.prototype._set_wrap_point = function() {
      if (this.__parent.wrap_line_length) {
        this.__wrap_point_index = this.__items.length;
        this.__wrap_point_character_count = this.__character_count;
        this.__wrap_point_indent_count = this.__parent.next_line.__indent_count;
        this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count;
      }
    };
    OutputLine.prototype._should_wrap = function() {
      return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
    };
    OutputLine.prototype._allow_wrap = function() {
      if (this._should_wrap()) {
        this.__parent.add_new_line();
        var next = this.__parent.current_line;
        next.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count);
        next.__items = this.__items.slice(this.__wrap_point_index);
        this.__items = this.__items.slice(0, this.__wrap_point_index);
        next.__character_count += this.__character_count - this.__wrap_point_character_count;
        this.__character_count = this.__wrap_point_character_count;
        if (next.__items[0] === " ") {
          next.__items.splice(0, 1);
          next.__character_count -= 1;
        }
        return true;
      }
      return false;
    };
    OutputLine.prototype.is_empty = function() {
      return this.__items.length === 0;
    };
    OutputLine.prototype.last = function() {
      if (!this.is_empty()) {
        return this.__items[this.__items.length - 1];
      } else {
        return null;
      }
    };
    OutputLine.prototype.push = function(item) {
      this.__items.push(item);
      var last_newline_index = item.lastIndexOf("\n");
      if (last_newline_index !== -1) {
        this.__character_count = item.length - last_newline_index;
      } else {
        this.__character_count += item.length;
      }
    };
    OutputLine.prototype.pop = function() {
      var item = null;
      if (!this.is_empty()) {
        item = this.__items.pop();
        this.__character_count -= item.length;
      }
      return item;
    };
    OutputLine.prototype._remove_indent = function() {
      if (this.__indent_count > 0) {
        this.__indent_count -= 1;
        this.__character_count -= this.__parent.indent_size;
      }
    };
    OutputLine.prototype._remove_wrap_indent = function() {
      if (this.__wrap_point_indent_count > 0) {
        this.__wrap_point_indent_count -= 1;
      }
    };
    OutputLine.prototype.trim = function() {
      while (this.last() === " ") {
        this.__items.pop();
        this.__character_count -= 1;
      }
    };
    OutputLine.prototype.toString = function() {
      var result = "";
      if (this.is_empty()) {
        if (this.__parent.indent_empty_lines) {
          result = this.__parent.get_indent_string(this.__indent_count);
        }
      } else {
        result = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count);
        result += this.__items.join("");
      }
      return result;
    };
    function IndentStringCache(options, baseIndentString) {
      this.__cache = [""];
      this.__indent_size = options.indent_size;
      this.__indent_string = options.indent_char;
      if (!options.indent_with_tabs) {
        this.__indent_string = new Array(options.indent_size + 1).join(options.indent_char);
      }
      baseIndentString = baseIndentString || "";
      if (options.indent_level > 0) {
        baseIndentString = new Array(options.indent_level + 1).join(this.__indent_string);
      }
      this.__base_string = baseIndentString;
      this.__base_string_length = baseIndentString.length;
    }
    IndentStringCache.prototype.get_indent_size = function(indent, column) {
      var result = this.__base_string_length;
      column = column || 0;
      if (indent < 0) {
        result = 0;
      }
      result += indent * this.__indent_size;
      result += column;
      return result;
    };
    IndentStringCache.prototype.get_indent_string = function(indent_level, column) {
      var result = this.__base_string;
      column = column || 0;
      if (indent_level < 0) {
        indent_level = 0;
        result = "";
      }
      column += indent_level * this.__indent_size;
      this.__ensure_cache(column);
      result += this.__cache[column];
      return result;
    };
    IndentStringCache.prototype.__ensure_cache = function(column) {
      while (column >= this.__cache.length) {
        this.__add_column();
      }
    };
    IndentStringCache.prototype.__add_column = function() {
      var column = this.__cache.length;
      var indent = 0;
      var result = "";
      if (this.__indent_size && column >= this.__indent_size) {
        indent = Math.floor(column / this.__indent_size);
        column -= indent * this.__indent_size;
        result = new Array(indent + 1).join(this.__indent_string);
      }
      if (column) {
        result += new Array(column + 1).join(" ");
      }
      this.__cache.push(result);
    };
    function Output(options, baseIndentString) {
      this.__indent_cache = new IndentStringCache(options, baseIndentString);
      this.raw = false;
      this._end_with_newline = options.end_with_newline;
      this.indent_size = options.indent_size;
      this.wrap_line_length = options.wrap_line_length;
      this.indent_empty_lines = options.indent_empty_lines;
      this.__lines = [];
      this.previous_line = null;
      this.current_line = null;
      this.next_line = new OutputLine(this);
      this.space_before_token = false;
      this.non_breaking_space = false;
      this.previous_token_wrapped = false;
      this.__add_outputline();
    }
    Output.prototype.__add_outputline = function() {
      this.previous_line = this.current_line;
      this.current_line = this.next_line.clone_empty();
      this.__lines.push(this.current_line);
    };
    Output.prototype.get_line_number = function() {
      return this.__lines.length;
    };
    Output.prototype.get_indent_string = function(indent, column) {
      return this.__indent_cache.get_indent_string(indent, column);
    };
    Output.prototype.get_indent_size = function(indent, column) {
      return this.__indent_cache.get_indent_size(indent, column);
    };
    Output.prototype.is_empty = function() {
      return !this.previous_line && this.current_line.is_empty();
    };
    Output.prototype.add_new_line = function(force_newline) {
      if (this.is_empty() || !force_newline && this.just_added_newline()) {
        return false;
      }
      if (!this.raw) {
        this.__add_outputline();
      }
      return true;
    };
    Output.prototype.get_code = function(eol) {
      this.trim(true);
      var last_item = this.current_line.pop();
      if (last_item) {
        if (last_item[last_item.length - 1] === "\n") {
          last_item = last_item.replace(/\n+$/g, "");
        }
        this.current_line.push(last_item);
      }
      if (this._end_with_newline) {
        this.__add_outputline();
      }
      var sweet_code = this.__lines.join("\n");
      if (eol !== "\n") {
        sweet_code = sweet_code.replace(/[\n]/g, eol);
      }
      return sweet_code;
    };
    Output.prototype.set_wrap_point = function() {
      this.current_line._set_wrap_point();
    };
    Output.prototype.set_indent = function(indent, alignment) {
      indent = indent || 0;
      alignment = alignment || 0;
      this.next_line.set_indent(indent, alignment);
      if (this.__lines.length > 1) {
        this.current_line.set_indent(indent, alignment);
        return true;
      }
      this.current_line.set_indent();
      return false;
    };
    Output.prototype.add_raw_token = function(token) {
      for (var x = 0; x < token.newlines; x++) {
        this.__add_outputline();
      }
      this.current_line.set_indent(-1);
      this.current_line.push(token.whitespace_before);
      this.current_line.push(token.text);
      this.space_before_token = false;
      this.non_breaking_space = false;
      this.previous_token_wrapped = false;
    };
    Output.prototype.add_token = function(printable_token) {
      this.__add_space_before_token();
      this.current_line.push(printable_token);
      this.space_before_token = false;
      this.non_breaking_space = false;
      this.previous_token_wrapped = this.current_line._allow_wrap();
    };
    Output.prototype.__add_space_before_token = function() {
      if (this.space_before_token && !this.just_added_newline()) {
        if (!this.non_breaking_space) {
          this.set_wrap_point();
        }
        this.current_line.push(" ");
      }
    };
    Output.prototype.remove_indent = function(index) {
      var output_length = this.__lines.length;
      while (index < output_length) {
        this.__lines[index]._remove_indent();
        index++;
      }
      this.current_line._remove_wrap_indent();
    };
    Output.prototype.trim = function(eat_newlines) {
      eat_newlines = eat_newlines === void 0 ? false : eat_newlines;
      this.current_line.trim();
      while (eat_newlines && this.__lines.length > 1 && this.current_line.is_empty()) {
        this.__lines.pop();
        this.current_line = this.__lines[this.__lines.length - 1];
        this.current_line.trim();
      }
      this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
    };
    Output.prototype.just_added_newline = function() {
      return this.current_line.is_empty();
    };
    Output.prototype.just_added_blankline = function() {
      return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
    };
    Output.prototype.ensure_empty_line_above = function(starts_with, ends_with) {
      var index = this.__lines.length - 2;
      while (index >= 0) {
        var potentialEmptyLine = this.__lines[index];
        if (potentialEmptyLine.is_empty()) {
          break;
        } else if (potentialEmptyLine.item(0).indexOf(starts_with) !== 0 && potentialEmptyLine.item(-1) !== ends_with) {
          this.__lines.splice(index + 1, 0, new OutputLine(this));
          this.previous_line = this.__lines[this.__lines.length - 2];
          break;
        }
        index--;
      }
    };
    module2.exports.Output = Output;
  }
});

// node_modules/js-beautify/js/src/core/token.js
var require_token = __commonJS({
  "node_modules/js-beautify/js/src/core/token.js"(exports2, module2) {
    "use strict";
    function Token(type, text, newlines, whitespace_before) {
      this.type = type;
      this.text = text;
      this.comments_before = null;
      this.newlines = newlines || 0;
      this.whitespace_before = whitespace_before || "";
      this.parent = null;
      this.next = null;
      this.previous = null;
      this.opened = null;
      this.closed = null;
      this.directives = null;
    }
    module2.exports.Token = Token;
  }
});

// node_modules/js-beautify/js/src/javascript/acorn.js
var require_acorn = __commonJS({
  "node_modules/js-beautify/js/src/javascript/acorn.js"(exports2) {
    "use strict";
    var baseASCIIidentifierStartChars = "\\x23\\x24\\x40\\x41-\\x5a\\x5f\\x61-\\x7a";
    var baseASCIIidentifierChars = "\\x24\\x30-\\x39\\x41-\\x5a\\x5f\\x61-\\x7a";
    var nonASCIIidentifierStartChars = "\\xaa\\xb5\\xba\\xc0-\\xd6\\xd8-\\xf6\\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0370-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u048a-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0620-\\u064a\\u066e\\u066f\\u0671-\\u06d3\\u06d5\\u06e5\\u06e6\\u06ee\\u06ef\\u06fa-\\u06fc\\u06ff\\u0710\\u0712-\\u072f\\u074d-\\u07a5\\u07b1\\u07ca-\\u07ea\\u07f4\\u07f5\\u07fa\\u0800-\\u0815\\u081a\\u0824\\u0828\\u0840-\\u0858\\u08a0\\u08a2-\\u08ac\\u0904-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097f\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bd\\u09ce\\u09dc\\u09dd\\u09df-\\u09e1\\u09f0\\u09f1\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a72-\\u0a74\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae1\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b71\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bd0\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c33\\u0c35-\\u0c39\\u0c3d\\u0c58\\u0c59\\u0c60\\u0c61\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbd\\u0cde\\u0ce0\\u0ce1\\u0cf1\\u0cf2\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d\\u0d4e\\u0d60\\u0d61\\u0d7a-\\u0d7f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e46\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0edc-\\u0edf\\u0f00\\u0f40-\\u0f47\\u0f49-\\u0f6c\\u0f88-\\u0f8c\\u1000-\\u102a\\u103f\\u1050-\\u1055\\u105a-\\u105d\\u1061\\u1065\\u1066\\u106e-\\u1070\\u1075-\\u1081\\u108e\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u1380-\\u138f\\u13a0-\\u13f4\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f0\\u1700-\\u170c\\u170e-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176c\\u176e-\\u1770\\u1780-\\u17b3\\u17d7\\u17dc\\u1820-\\u1877\\u1880-\\u18a8\\u18aa\\u18b0-\\u18f5\\u1900-\\u191c\\u1950-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19c1-\\u19c7\\u1a00-\\u1a16\\u1a20-\\u1a54\\u1aa7\\u1b05-\\u1b33\\u1b45-\\u1b4b\\u1b83-\\u1ba0\\u1bae\\u1baf\\u1bba-\\u1be5\\u1c00-\\u1c23\\u1c4d-\\u1c4f\\u1c5a-\\u1c7d\\u1ce9-\\u1cec\\u1cee-\\u1cf1\\u1cf5\\u1cf6\\u1d00-\\u1dbf\\u1e00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u2071\\u207f\\u2090-\\u209c\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2119-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u212d\\u212f-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2c2e\\u2c30-\\u2c5e\\u2c60-\\u2ce4\\u2ceb-\\u2cee\\u2cf2\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d80-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u2e2f\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u309d-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312d\\u3131-\\u318e\\u31a0-\\u31ba\\u31f0-\\u31ff\\u3400-\\u4db5\\u4e00-\\u9fcc\\ua000-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua61f\\ua62a\\ua62b\\ua640-\\ua66e\\ua67f-\\ua697\\ua6a0-\\ua6ef\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua78e\\ua790-\\ua793\\ua7a0-\\ua7aa\\ua7f8-\\ua801\\ua803-\\ua805\\ua807-\\ua80a\\ua80c-\\ua822\\ua840-\\ua873\\ua882-\\ua8b3\\ua8f2-\\ua8f7\\ua8fb\\ua90a-\\ua925\\ua930-\\ua946\\ua960-\\ua97c\\ua984-\\ua9b2\\ua9cf\\uaa00-\\uaa28\\uaa40-\\uaa42\\uaa44-\\uaa4b\\uaa60-\\uaa76\\uaa7a\\uaa80-\\uaaaf\\uaab1\\uaab5\\uaab6\\uaab9-\\uaabd\\uaac0\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaea\\uaaf2-\\uaaf4\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uabc0-\\uabe2\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff21-\\uff3a\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc";
    var nonASCIIidentifierChars = "\\u0300-\\u036f\\u0483-\\u0487\\u0591-\\u05bd\\u05bf\\u05c1\\u05c2\\u05c4\\u05c5\\u05c7\\u0610-\\u061a\\u0620-\\u0649\\u0672-\\u06d3\\u06e7-\\u06e8\\u06fb-\\u06fc\\u0730-\\u074a\\u0800-\\u0814\\u081b-\\u0823\\u0825-\\u0827\\u0829-\\u082d\\u0840-\\u0857\\u08e4-\\u08fe\\u0900-\\u0903\\u093a-\\u093c\\u093e-\\u094f\\u0951-\\u0957\\u0962-\\u0963\\u0966-\\u096f\\u0981-\\u0983\\u09bc\\u09be-\\u09c4\\u09c7\\u09c8\\u09d7\\u09df-\\u09e0\\u0a01-\\u0a03\\u0a3c\\u0a3e-\\u0a42\\u0a47\\u0a48\\u0a4b-\\u0a4d\\u0a51\\u0a66-\\u0a71\\u0a75\\u0a81-\\u0a83\\u0abc\\u0abe-\\u0ac5\\u0ac7-\\u0ac9\\u0acb-\\u0acd\\u0ae2-\\u0ae3\\u0ae6-\\u0aef\\u0b01-\\u0b03\\u0b3c\\u0b3e-\\u0b44\\u0b47\\u0b48\\u0b4b-\\u0b4d\\u0b56\\u0b57\\u0b5f-\\u0b60\\u0b66-\\u0b6f\\u0b82\\u0bbe-\\u0bc2\\u0bc6-\\u0bc8\\u0bca-\\u0bcd\\u0bd7\\u0be6-\\u0bef\\u0c01-\\u0c03\\u0c46-\\u0c48\\u0c4a-\\u0c4d\\u0c55\\u0c56\\u0c62-\\u0c63\\u0c66-\\u0c6f\\u0c82\\u0c83\\u0cbc\\u0cbe-\\u0cc4\\u0cc6-\\u0cc8\\u0cca-\\u0ccd\\u0cd5\\u0cd6\\u0ce2-\\u0ce3\\u0ce6-\\u0cef\\u0d02\\u0d03\\u0d46-\\u0d48\\u0d57\\u0d62-\\u0d63\\u0d66-\\u0d6f\\u0d82\\u0d83\\u0dca\\u0dcf-\\u0dd4\\u0dd6\\u0dd8-\\u0ddf\\u0df2\\u0df3\\u0e34-\\u0e3a\\u0e40-\\u0e45\\u0e50-\\u0e59\\u0eb4-\\u0eb9\\u0ec8-\\u0ecd\\u0ed0-\\u0ed9\\u0f18\\u0f19\\u0f20-\\u0f29\\u0f35\\u0f37\\u0f39\\u0f41-\\u0f47\\u0f71-\\u0f84\\u0f86-\\u0f87\\u0f8d-\\u0f97\\u0f99-\\u0fbc\\u0fc6\\u1000-\\u1029\\u1040-\\u1049\\u1067-\\u106d\\u1071-\\u1074\\u1082-\\u108d\\u108f-\\u109d\\u135d-\\u135f\\u170e-\\u1710\\u1720-\\u1730\\u1740-\\u1750\\u1772\\u1773\\u1780-\\u17b2\\u17dd\\u17e0-\\u17e9\\u180b-\\u180d\\u1810-\\u1819\\u1920-\\u192b\\u1930-\\u193b\\u1951-\\u196d\\u19b0-\\u19c0\\u19c8-\\u19c9\\u19d0-\\u19d9\\u1a00-\\u1a15\\u1a20-\\u1a53\\u1a60-\\u1a7c\\u1a7f-\\u1a89\\u1a90-\\u1a99\\u1b46-\\u1b4b\\u1b50-\\u1b59\\u1b6b-\\u1b73\\u1bb0-\\u1bb9\\u1be6-\\u1bf3\\u1c00-\\u1c22\\u1c40-\\u1c49\\u1c5b-\\u1c7d\\u1cd0-\\u1cd2\\u1d00-\\u1dbe\\u1e01-\\u1f15\\u200c\\u200d\\u203f\\u2040\\u2054\\u20d0-\\u20dc\\u20e1\\u20e5-\\u20f0\\u2d81-\\u2d96\\u2de0-\\u2dff\\u3021-\\u3028\\u3099\\u309a\\ua640-\\ua66d\\ua674-\\ua67d\\ua69f\\ua6f0-\\ua6f1\\ua7f8-\\ua800\\ua806\\ua80b\\ua823-\\ua827\\ua880-\\ua881\\ua8b4-\\ua8c4\\ua8d0-\\ua8d9\\ua8f3-\\ua8f7\\ua900-\\ua909\\ua926-\\ua92d\\ua930-\\ua945\\ua980-\\ua983\\ua9b3-\\ua9c0\\uaa00-\\uaa27\\uaa40-\\uaa41\\uaa4c-\\uaa4d\\uaa50-\\uaa59\\uaa7b\\uaae0-\\uaae9\\uaaf2-\\uaaf3\\uabc0-\\uabe1\\uabec\\uabed\\uabf0-\\uabf9\\ufb20-\\ufb28\\ufe00-\\ufe0f\\ufe20-\\ufe26\\ufe33\\ufe34\\ufe4d-\\ufe4f\\uff10-\\uff19\\uff3f";
    var unicodeEscapeOrCodePoint = "\\\\u[0-9a-fA-F]{4}|\\\\u\\{[0-9a-fA-F]+\\}";
    var identifierStart = "(?:" + unicodeEscapeOrCodePoint + "|[" + baseASCIIidentifierStartChars + nonASCIIidentifierStartChars + "])";
    var identifierChars = "(?:" + unicodeEscapeOrCodePoint + "|[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "])*";
    exports2.identifier = new RegExp(identifierStart + identifierChars, "g");
    exports2.identifierStart = new RegExp(identifierStart);
    exports2.identifierMatch = new RegExp("(?:" + unicodeEscapeOrCodePoint + "|[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "])+");
    exports2.newline = /[\n\r\u2028\u2029]/;
    exports2.lineBreak = new RegExp("\r\n|" + exports2.newline.source);
    exports2.allLineBreaks = new RegExp(exports2.lineBreak.source, "g");
  }
});

// node_modules/js-beautify/js/src/core/options.js
var require_options = __commonJS({
  "node_modules/js-beautify/js/src/core/options.js"(exports2, module2) {
    "use strict";
    function Options(options, merge_child_field) {
      this.raw_options = _mergeOpts(options, merge_child_field);
      this.disabled = this._get_boolean("disabled");
      this.eol = this._get_characters("eol", "auto");
      this.end_with_newline = this._get_boolean("end_with_newline");
      this.indent_size = this._get_number("indent_size", 4);
      this.indent_char = this._get_characters("indent_char", " ");
      this.indent_level = this._get_number("indent_level");
      this.preserve_newlines = this._get_boolean("preserve_newlines", true);
      this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786);
      if (!this.preserve_newlines) {
        this.max_preserve_newlines = 0;
      }
      this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	");
      if (this.indent_with_tabs) {
        this.indent_char = "	";
        if (this.indent_size === 1) {
          this.indent_size = 4;
        }
      }
      this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char"));
      this.indent_empty_lines = this._get_boolean("indent_empty_lines");
      this.templating = this._get_selection_list("templating", ["auto", "none", "angular", "django", "erb", "handlebars", "php", "smarty"], ["auto"]);
    }
    Options.prototype._get_array = function(name, default_value) {
      var option_value = this.raw_options[name];
      var result = default_value || [];
      if (typeof option_value === "object") {
        if (option_value !== null && typeof option_value.concat === "function") {
          result = option_value.concat();
        }
      } else if (typeof option_value === "string") {
        result = option_value.split(/[^a-zA-Z0-9_\/\-]+/);
      }
      return result;
    };
    Options.prototype._get_boolean = function(name, default_value) {
      var option_value = this.raw_options[name];
      var result = option_value === void 0 ? !!default_value : !!option_value;
      return result;
    };
    Options.prototype._get_characters = function(name, default_value) {
      var option_value = this.raw_options[name];
      var result = default_value || "";
      if (typeof option_value === "string") {
        result = option_value.replace(/\\r/, "\r").replace(/\\n/, "\n").replace(/\\t/, "	");
      }
      return result;
    };
    Options.prototype._get_number = function(name, default_value) {
      var option_value = this.raw_options[name];
      default_value = parseInt(default_value, 10);
      if (isNaN(default_value)) {
        default_value = 0;
      }
      var result = parseInt(option_value, 10);
      if (isNaN(result)) {
        result = default_value;
      }
      return result;
    };
    Options.prototype._get_selection = function(name, selection_list, default_value) {
      var result = this._get_selection_list(name, selection_list, default_value);
      if (result.length !== 1) {
        throw new Error(
          "Invalid Option Value: The option '" + name + "' can only be one of the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'"
        );
      }
      return result[0];
    };
    Options.prototype._get_selection_list = function(name, selection_list, default_value) {
      if (!selection_list || selection_list.length === 0) {
        throw new Error("Selection list cannot be empty.");
      }
      default_value = default_value || [selection_list[0]];
      if (!this._is_valid_selection(default_value, selection_list)) {
        throw new Error("Invalid Default Value!");
      }
      var result = this._get_array(name, default_value);
      if (!this._is_valid_selection(result, selection_list)) {
        throw new Error(
          "Invalid Option Value: The option '" + name + "' can contain only the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'"
        );
      }
      return result;
    };
    Options.prototype._is_valid_selection = function(result, selection_list) {
      return result.length && selection_list.length && !result.some(function(item) {
        return selection_list.indexOf(item) === -1;
      });
    };
    function _mergeOpts(allOptions, childFieldName) {
      var finalOpts = {};
      allOptions = _normalizeOpts(allOptions);
      var name;
      for (name in allOptions) {
        if (name !== childFieldName) {
          finalOpts[name] = allOptions[name];
        }
      }
      if (childFieldName && allOptions[childFieldName]) {
        for (name in allOptions[childFieldName]) {
          finalOpts[name] = allOptions[childFieldName][name];
        }
      }
      return finalOpts;
    }
    function _normalizeOpts(options) {
      var convertedOpts = {};
      var key;
      for (key in options) {
        var newKey = key.replace(/-/g, "_");
        convertedOpts[newKey] = options[key];
      }
      return convertedOpts;
    }
    module2.exports.Options = Options;
    module2.exports.normalizeOpts = _normalizeOpts;
    module2.exports.mergeOpts = _mergeOpts;
  }
});

// node_modules/js-beautify/js/src/javascript/options.js
var require_options2 = __commonJS({
  "node_modules/js-beautify/js/src/javascript/options.js"(exports2, module2) {
    "use strict";
    var BaseOptions = require_options().Options;
    var validPositionValues = ["before-newline", "after-newline", "preserve-newline"];
    function Options(options) {
      BaseOptions.call(this, options, "js");
      var raw_brace_style = this.raw_options.brace_style || null;
      if (raw_brace_style === "expand-strict") {
        this.raw_options.brace_style = "expand";
      } else if (raw_brace_style === "collapse-preserve-inline") {
        this.raw_options.brace_style = "collapse,preserve-inline";
      } else if (this.raw_options.braces_on_own_line !== void 0) {
        this.raw_options.brace_style = this.raw_options.braces_on_own_line ? "expand" : "collapse";
      }
      var brace_style_split = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
      this.brace_preserve_inline = false;
      this.brace_style = "collapse";
      for (var bs = 0; bs < brace_style_split.length; bs++) {
        if (brace_style_split[bs] === "preserve-inline") {
          this.brace_preserve_inline = true;
        } else {
          this.brace_style = brace_style_split[bs];
        }
      }
      this.unindent_chained_methods = this._get_boolean("unindent_chained_methods");
      this.break_chained_methods = this._get_boolean("break_chained_methods");
      this.space_in_paren = this._get_boolean("space_in_paren");
      this.space_in_empty_paren = this._get_boolean("space_in_empty_paren");
      this.jslint_happy = this._get_boolean("jslint_happy");
      this.space_after_anon_function = this._get_boolean("space_after_anon_function");
      this.space_after_named_function = this._get_boolean("space_after_named_function");
      this.keep_array_indentation = this._get_boolean("keep_array_indentation");
      this.space_before_conditional = this._get_boolean("space_before_conditional", true);
      this.unescape_strings = this._get_boolean("unescape_strings");
      this.e4x = this._get_boolean("e4x");
      this.comma_first = this._get_boolean("comma_first");
      this.operator_position = this._get_selection("operator_position", validPositionValues);
      this.test_output_raw = this._get_boolean("test_output_raw");
      if (this.jslint_happy) {
        this.space_after_anon_function = true;
      }
    }
    Options.prototype = new BaseOptions();
    module2.exports.Options = Options;
  }
});

// node_modules/js-beautify/js/src/core/inputscanner.js
var require_inputscanner = __commonJS({
  "node_modules/js-beautify/js/src/core/inputscanner.js"(exports2, module2) {
    "use strict";
    var regexp_has_sticky = RegExp.prototype.hasOwnProperty("sticky");
    function InputScanner(input_string) {
      this.__input = input_string || "";
      this.__input_length = this.__input.length;
      this.__position = 0;
    }
    InputScanner.prototype.restart = function() {
      this.__position = 0;
    };
    InputScanner.prototype.back = function() {
      if (this.__position > 0) {
        this.__position -= 1;
      }
    };
    InputScanner.prototype.hasNext = function() {
      return this.__position < this.__input_length;
    };
    InputScanner.prototype.next = function() {
      var val = null;
      if (this.hasNext()) {
        val = this.__input.charAt(this.__position);
        this.__position += 1;
      }
      return val;
    };
    InputScanner.prototype.peek = function(index) {
      var val = null;
      index = index || 0;
      index += this.__position;
      if (index >= 0 && index < this.__input_length) {
        val = this.__input.charAt(index);
      }
      return val;
    };
    InputScanner.prototype.__match = function(pattern, index) {
      pattern.lastIndex = index;
      var pattern_match = pattern.exec(this.__input);
      if (pattern_match && !(regexp_has_sticky && pattern.sticky)) {
        if (pattern_match.index !== index) {
          pattern_match = null;
        }
      }
      return pattern_match;
    };
    InputScanner.prototype.test = function(pattern, index) {
      index = index || 0;
      index += this.__position;
      if (index >= 0 && index < this.__input_length) {
        return !!this.__match(pattern, index);
      } else {
        return false;
      }
    };
    InputScanner.prototype.testChar = function(pattern, index) {
      var val = this.peek(index);
      pattern.lastIndex = 0;
      return val !== null && pattern.test(val);
    };
    InputScanner.prototype.match = function(pattern) {
      var pattern_match = this.__match(pattern, this.__position);
      if (pattern_match) {
        this.__position += pattern_match[0].length;
      } else {
        pattern_match = null;
      }
      return pattern_match;
    };
    InputScanner.prototype.read = function(starting_pattern, until_pattern, until_after) {
      var val = "";
      var match;
      if (starting_pattern) {
        match = this.match(starting_pattern);
        if (match) {
          val += match[0];
        }
      }
      if (until_pattern && (match || !starting_pattern)) {
        val += this.readUntil(until_pattern, until_after);
      }
      return val;
    };
    InputScanner.prototype.readUntil = function(pattern, until_after) {
      var val = "";
      var match_index = this.__position;
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);
      if (pattern_match) {
        match_index = pattern_match.index;
        if (until_after) {
          match_index += pattern_match[0].length;
        }
      } else {
        match_index = this.__input_length;
      }
      val = this.__input.substring(this.__position, match_index);
      this.__position = match_index;
      return val;
    };
    InputScanner.prototype.readUntilAfter = function(pattern) {
      return this.readUntil(pattern, true);
    };
    InputScanner.prototype.get_regexp = function(pattern, match_from) {
      var result = null;
      var flags = "g";
      if (match_from && regexp_has_sticky) {
        flags = "y";
      }
      if (typeof pattern === "string" && pattern !== "") {
        result = new RegExp(pattern, flags);
      } else if (pattern) {
        result = new RegExp(pattern.source, flags);
      }
      return result;
    };
    InputScanner.prototype.get_literal_regexp = function(literal_string) {
      return RegExp(literal_string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
    };
    InputScanner.prototype.peekUntilAfter = function(pattern) {
      var start = this.__position;
      var val = this.readUntilAfter(pattern);
      this.__position = start;
      return val;
    };
    InputScanner.prototype.lookBack = function(testVal) {
      var start = this.__position - 1;
      return start >= testVal.length && this.__input.substring(start - testVal.length, start).toLowerCase() === testVal;
    };
    module2.exports.InputScanner = InputScanner;
  }
});

// node_modules/js-beautify/js/src/core/tokenstream.js
var require_tokenstream = __commonJS({
  "node_modules/js-beautify/js/src/core/tokenstream.js"(exports2, module2) {
    "use strict";
    function TokenStream(parent_token) {
      this.__tokens = [];
      this.__tokens_length = this.__tokens.length;
      this.__position = 0;
      this.__parent_token = parent_token;
    }
    TokenStream.prototype.restart = function() {
      this.__position = 0;
    };
    TokenStream.prototype.isEmpty = function() {
      return this.__tokens_length === 0;
    };
    TokenStream.prototype.hasNext = function() {
      return this.__position < this.__tokens_length;
    };
    TokenStream.prototype.next = function() {
      var val = null;
      if (this.hasNext()) {
        val = this.__tokens[this.__position];
        this.__position += 1;
      }
      return val;
    };
    TokenStream.prototype.peek = function(index) {
      var val = null;
      index = index || 0;
      index += this.__position;
      if (index >= 0 && index < this.__tokens_length) {
        val = this.__tokens[index];
      }
      return val;
    };
    TokenStream.prototype.add = function(token) {
      if (this.__parent_token) {
        token.parent = this.__parent_token;
      }
      this.__tokens.push(token);
      this.__tokens_length += 1;
    };
    module2.exports.TokenStream = TokenStream;
  }
});

// node_modules/js-beautify/js/src/core/pattern.js
var require_pattern = __commonJS({
  "node_modules/js-beautify/js/src/core/pattern.js"(exports2, module2) {
    "use strict";
    function Pattern(input_scanner, parent) {
      this._input = input_scanner;
      this._starting_pattern = null;
      this._match_pattern = null;
      this._until_pattern = null;
      this._until_after = false;
      if (parent) {
        this._starting_pattern = this._input.get_regexp(parent._starting_pattern, true);
        this._match_pattern = this._input.get_regexp(parent._match_pattern, true);
        this._until_pattern = this._input.get_regexp(parent._until_pattern);
        this._until_after = parent._until_after;
      }
    }
    Pattern.prototype.read = function() {
      var result = this._input.read(this._starting_pattern);
      if (!this._starting_pattern || result) {
        result += this._input.read(this._match_pattern, this._until_pattern, this._until_after);
      }
      return result;
    };
    Pattern.prototype.read_match = function() {
      return this._input.match(this._match_pattern);
    };
    Pattern.prototype.until_after = function(pattern) {
      var result = this._create();
      result._until_after = true;
      result._until_pattern = this._input.get_regexp(pattern);
      result._update();
      return result;
    };
    Pattern.prototype.until = function(pattern) {
      var result = this._create();
      result._until_after = false;
      result._until_pattern = this._input.get_regexp(pattern);
      result._update();
      return result;
    };
    Pattern.prototype.starting_with = function(pattern) {
      var result = this._create();
      result._starting_pattern = this._input.get_regexp(pattern, true);
      result._update();
      return result;
    };
    Pattern.prototype.matching = function(pattern) {
      var result = this._create();
      result._match_pattern = this._input.get_regexp(pattern, true);
      result._update();
      return result;
    };
    Pattern.prototype._create = function() {
      return new Pattern(this._input, this);
    };
    Pattern.prototype._update = function() {
    };
    module2.exports.Pattern = Pattern;
  }
});

// node_modules/js-beautify/js/src/core/whitespacepattern.js
var require_whitespacepattern = __commonJS({
  "node_modules/js-beautify/js/src/core/whitespacepattern.js"(exports2, module2) {
    "use strict";
    var Pattern = require_pattern().Pattern;
    function WhitespacePattern(input_scanner, parent) {
      Pattern.call(this, input_scanner, parent);
      if (parent) {
        this._line_regexp = this._input.get_regexp(parent._line_regexp);
      } else {
        this.__set_whitespace_patterns("", "");
      }
      this.newline_count = 0;
      this.whitespace_before_token = "";
    }
    WhitespacePattern.prototype = new Pattern();
    WhitespacePattern.prototype.__set_whitespace_patterns = function(whitespace_chars, newline_chars) {
      whitespace_chars += "\\t ";
      newline_chars += "\\n\\r";
      this._match_pattern = this._input.get_regexp(
        "[" + whitespace_chars + newline_chars + "]+",
        true
      );
      this._newline_regexp = this._input.get_regexp(
        "\\r\\n|[" + newline_chars + "]"
      );
    };
    WhitespacePattern.prototype.read = function() {
      this.newline_count = 0;
      this.whitespace_before_token = "";
      var resulting_string = this._input.read(this._match_pattern);
      if (resulting_string === " ") {
        this.whitespace_before_token = " ";
      } else if (resulting_string) {
        var matches = this.__split(this._newline_regexp, resulting_string);
        this.newline_count = matches.length - 1;
        this.whitespace_before_token = matches[this.newline_count];
      }
      return resulting_string;
    };
    WhitespacePattern.prototype.matching = function(whitespace_chars, newline_chars) {
      var result = this._create();
      result.__set_whitespace_patterns(whitespace_chars, newline_chars);
      result._update();
      return result;
    };
    WhitespacePattern.prototype._create = function() {
      return new WhitespacePattern(this._input, this);
    };
    WhitespacePattern.prototype.__split = function(regexp, input_string) {
      regexp.lastIndex = 0;
      var start_index = 0;
      var result = [];
      var next_match = regexp.exec(input_string);
      while (next_match) {
        result.push(input_string.substring(start_index, next_match.index));
        start_index = next_match.index + next_match[0].length;
        next_match = regexp.exec(input_string);
      }
      if (start_index < input_string.length) {
        result.push(input_string.substring(start_index, input_string.length));
      } else {
        result.push("");
      }
      return result;
    };
    module2.exports.WhitespacePattern = WhitespacePattern;
  }
});

// node_modules/js-beautify/js/src/core/tokenizer.js
var require_tokenizer = __commonJS({
  "node_modules/js-beautify/js/src/core/tokenizer.js"(exports2, module2) {
    "use strict";
    var InputScanner = require_inputscanner().InputScanner;
    var Token = require_token().Token;
    var TokenStream = require_tokenstream().TokenStream;
    var WhitespacePattern = require_whitespacepattern().WhitespacePattern;
    var TOKEN = {
      START: "TK_START",
      RAW: "TK_RAW",
      EOF: "TK_EOF"
    };
    var Tokenizer = function(input_string, options) {
      this._input = new InputScanner(input_string);
      this._options = options || {};
      this.__tokens = null;
      this._patterns = {};
      this._patterns.whitespace = new WhitespacePattern(this._input);
    };
    Tokenizer.prototype.tokenize = function() {
      this._input.restart();
      this.__tokens = new TokenStream();
      this._reset();
      var current;
      var previous = new Token(TOKEN.START, "");
      var open_token = null;
      var open_stack = [];
      var comments = new TokenStream();
      while (previous.type !== TOKEN.EOF) {
        current = this._get_next_token(previous, open_token);
        while (this._is_comment(current)) {
          comments.add(current);
          current = this._get_next_token(previous, open_token);
        }
        if (!comments.isEmpty()) {
          current.comments_before = comments;
          comments = new TokenStream();
        }
        current.parent = open_token;
        if (this._is_opening(current)) {
          open_stack.push(open_token);
          open_token = current;
        } else if (open_token && this._is_closing(current, open_token)) {
          current.opened = open_token;
          open_token.closed = current;
          open_token = open_stack.pop();
          current.parent = open_token;
        }
        current.previous = previous;
        previous.next = current;
        this.__tokens.add(current);
        previous = current;
      }
      return this.__tokens;
    };
    Tokenizer.prototype._is_first_token = function() {
      return this.__tokens.isEmpty();
    };
    Tokenizer.prototype._reset = function() {
    };
    Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
      this._readWhitespace();
      var resulting_string = this._input.read(/.+/g);
      if (resulting_string) {
        return this._create_token(TOKEN.RAW, resulting_string);
      } else {
        return this._create_token(TOKEN.EOF, "");
      }
    };
    Tokenizer.prototype._is_comment = function(current_token) {
      return false;
    };
    Tokenizer.prototype._is_opening = function(current_token) {
      return false;
    };
    Tokenizer.prototype._is_closing = function(current_token, open_token) {
      return false;
    };
    Tokenizer.prototype._create_token = function(type, text) {
      var token = new Token(
        type,
        text,
        this._patterns.whitespace.newline_count,
        this._patterns.whitespace.whitespace_before_token
      );
      return token;
    };
    Tokenizer.prototype._readWhitespace = function() {
      return this._patterns.whitespace.read();
    };
    module2.exports.Tokenizer = Tokenizer;
    module2.exports.TOKEN = TOKEN;
  }
});

// node_modules/js-beautify/js/src/core/directives.js
var require_directives = __commonJS({
  "node_modules/js-beautify/js/src/core/directives.js"(exports2, module2) {
    "use strict";
    function Directives(start_block_pattern, end_block_pattern) {
      start_block_pattern = typeof start_block_pattern === "string" ? start_block_pattern : start_block_pattern.source;
      end_block_pattern = typeof end_block_pattern === "string" ? end_block_pattern : end_block_pattern.source;
      this.__directives_block_pattern = new RegExp(start_block_pattern + / beautify( \w+[:]\w+)+ /.source + end_block_pattern, "g");
      this.__directive_pattern = / (\w+)[:](\w+)/g;
      this.__directives_end_ignore_pattern = new RegExp(start_block_pattern + /\sbeautify\signore:end\s/.source + end_block_pattern, "g");
    }
    Directives.prototype.get_directives = function(text) {
      if (!text.match(this.__directives_block_pattern)) {
        return null;
      }
      var directives = {};
      this.__directive_pattern.lastIndex = 0;
      var directive_match = this.__directive_pattern.exec(text);
      while (directive_match) {
        directives[directive_match[1]] = directive_match[2];
        directive_match = this.__directive_pattern.exec(text);
      }
      return directives;
    };
    Directives.prototype.readIgnored = function(input) {
      return input.readUntilAfter(this.__directives_end_ignore_pattern);
    };
    module2.exports.Directives = Directives;
  }
});

// node_modules/js-beautify/js/src/core/templatablepattern.js
var require_templatablepattern = __commonJS({
  "node_modules/js-beautify/js/src/core/templatablepattern.js"(exports2, module2) {
    "use strict";
    var Pattern = require_pattern().Pattern;
    var template_names = {
      django: false,
      erb: false,
      handlebars: false,
      php: false,
      smarty: false,
      angular: false
    };
    function TemplatablePattern(input_scanner, parent) {
      Pattern.call(this, input_scanner, parent);
      this.__template_pattern = null;
      this._disabled = Object.assign({}, template_names);
      this._excluded = Object.assign({}, template_names);
      if (parent) {
        this.__template_pattern = this._input.get_regexp(parent.__template_pattern);
        this._excluded = Object.assign(this._excluded, parent._excluded);
        this._disabled = Object.assign(this._disabled, parent._disabled);
      }
      var pattern = new Pattern(input_scanner);
      this.__patterns = {
        handlebars_comment: pattern.starting_with(/{{!--/).until_after(/--}}/),
        handlebars_unescaped: pattern.starting_with(/{{{/).until_after(/}}}/),
        handlebars: pattern.starting_with(/{{/).until_after(/}}/),
        php: pattern.starting_with(/<\?(?:[= ]|php)/).until_after(/\?>/),
        erb: pattern.starting_with(/<%[^%]/).until_after(/[^%]%>/),
        // django coflicts with handlebars a bit.
        django: pattern.starting_with(/{%/).until_after(/%}/),
        django_value: pattern.starting_with(/{{/).until_after(/}}/),
        django_comment: pattern.starting_with(/{#/).until_after(/#}/),
        smarty: pattern.starting_with(/{(?=[^}{\s\n])/).until_after(/[^\s\n]}/),
        smarty_comment: pattern.starting_with(/{\*/).until_after(/\*}/),
        smarty_literal: pattern.starting_with(/{literal}/).until_after(/{\/literal}/)
      };
    }
    TemplatablePattern.prototype = new Pattern();
    TemplatablePattern.prototype._create = function() {
      return new TemplatablePattern(this._input, this);
    };
    TemplatablePattern.prototype._update = function() {
      this.__set_templated_pattern();
    };
    TemplatablePattern.prototype.disable = function(language) {
      var result = this._create();
      result._disabled[language] = true;
      result._update();
      return result;
    };
    TemplatablePattern.prototype.read_options = function(options) {
      var result = this._create();
      for (var language in template_names) {
        result._disabled[language] = options.templating.indexOf(language) === -1;
      }
      result._update();
      return result;
    };
    TemplatablePattern.prototype.exclude = function(language) {
      var result = this._create();
      result._excluded[language] = true;
      result._update();
      return result;
    };
    TemplatablePattern.prototype.read = function() {
      var result = "";
      if (this._match_pattern) {
        result = this._input.read(this._starting_pattern);
      } else {
        result = this._input.read(this._starting_pattern, this.__template_pattern);
      }
      var next = this._read_template();
      while (next) {
        if (this._match_pattern) {
          next += this._input.read(this._match_pattern);
        } else {
          next += this._input.readUntil(this.__template_pattern);
        }
        result += next;
        next = this._read_template();
      }
      if (this._until_after) {
        result += this._input.readUntilAfter(this._until_pattern);
      }
      return result;
    };
    TemplatablePattern.prototype.__set_templated_pattern = function() {
      var items = [];
      if (!this._disabled.php) {
        items.push(this.__patterns.php._starting_pattern.source);
      }
      if (!this._disabled.handlebars) {
        items.push(this.__patterns.handlebars._starting_pattern.source);
      }
      if (!this._disabled.angular) {
        items.push(this.__patterns.handlebars._starting_pattern.source);
      }
      if (!this._disabled.erb) {
        items.push(this.__patterns.erb._starting_pattern.source);
      }
      if (!this._disabled.django) {
        items.push(this.__patterns.django._starting_pattern.source);
        items.push(this.__patterns.django_value._starting_pattern.source);
        items.push(this.__patterns.django_comment._starting_pattern.source);
      }
      if (!this._disabled.smarty) {
        items.push(this.__patterns.smarty._starting_pattern.source);
      }
      if (this._until_pattern) {
        items.push(this._until_pattern.source);
      }
      this.__template_pattern = this._input.get_regexp("(?:" + items.join("|") + ")");
    };
    TemplatablePattern.prototype._read_template = function() {
      var resulting_string = "";
      var c = this._input.peek();
      if (c === "<") {
        var peek1 = this._input.peek(1);
        if (!this._disabled.php && !this._excluded.php && peek1 === "?") {
          resulting_string = resulting_string || this.__patterns.php.read();
        }
        if (!this._disabled.erb && !this._excluded.erb && peek1 === "%") {
          resulting_string = resulting_string || this.__patterns.erb.read();
        }
      } else if (c === "{") {
        if (!this._disabled.handlebars && !this._excluded.handlebars) {
          resulting_string = resulting_string || this.__patterns.handlebars_comment.read();
          resulting_string = resulting_string || this.__patterns.handlebars_unescaped.read();
          resulting_string = resulting_string || this.__patterns.handlebars.read();
        }
        if (!this._disabled.django) {
          if (!this._excluded.django && !this._excluded.handlebars) {
            resulting_string = resulting_string || this.__patterns.django_value.read();
          }
          if (!this._excluded.django) {
            resulting_string = resulting_string || this.__patterns.django_comment.read();
            resulting_string = resulting_string || this.__patterns.django.read();
          }
        }
        if (!this._disabled.smarty) {
          if (this._disabled.django && this._disabled.handlebars) {
            resulting_string = resulting_string || this.__patterns.smarty_comment.read();
            resulting_string = resulting_string || this.__patterns.smarty_literal.read();
            resulting_string = resulting_string || this.__patterns.smarty.read();
          }
        }
      }
      return resulting_string;
    };
    module2.exports.TemplatablePattern = TemplatablePattern;
  }
});

// node_modules/js-beautify/js/src/javascript/tokenizer.js
var require_tokenizer2 = __commonJS({
  "node_modules/js-beautify/js/src/javascript/tokenizer.js"(exports2, module2) {
    "use strict";
    var InputScanner = require_inputscanner().InputScanner;
    var BaseTokenizer = require_tokenizer().Tokenizer;
    var BASETOKEN = require_tokenizer().TOKEN;
    var Directives = require_directives().Directives;
    var acorn = require_acorn();
    var Pattern = require_pattern().Pattern;
    var TemplatablePattern = require_templatablepattern().TemplatablePattern;
    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }
    var TOKEN = {
      START_EXPR: "TK_START_EXPR",
      END_EXPR: "TK_END_EXPR",
      START_BLOCK: "TK_START_BLOCK",
      END_BLOCK: "TK_END_BLOCK",
      WORD: "TK_WORD",
      RESERVED: "TK_RESERVED",
      SEMICOLON: "TK_SEMICOLON",
      STRING: "TK_STRING",
      EQUALS: "TK_EQUALS",
      OPERATOR: "TK_OPERATOR",
      COMMA: "TK_COMMA",
      BLOCK_COMMENT: "TK_BLOCK_COMMENT",
      COMMENT: "TK_COMMENT",
      DOT: "TK_DOT",
      UNKNOWN: "TK_UNKNOWN",
      START: BASETOKEN.START,
      RAW: BASETOKEN.RAW,
      EOF: BASETOKEN.EOF
    };
    var directives_core = new Directives(/\/\*/, /\*\//);
    var number_pattern = /0[xX][0123456789abcdefABCDEF_]*n?|0[oO][01234567_]*n?|0[bB][01_]*n?|\d[\d_]*n|(?:\.\d[\d_]*|\d[\d_]*\.?[\d_]*)(?:[eE][+-]?[\d_]+)?/;
    var digit = /[0-9]/;
    var dot_pattern = /[^\d\.]/;
    var positionable_operators = ">>> === !== &&= ??= ||= << && >= ** != == <= >> || ?? |> < / - + > : & % ? ^ | *".split(" ");
    var punct = ">>>= ... >>= <<= === >>> !== **= &&= ??= ||= => ^= :: /= << <= == && -= >= >> != -- += ** || ?? ++ %= &= *= |= |> = ! ? > < : / ^ - + * & % ~ |";
    punct = punct.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
    punct = "\\?\\.(?!\\d) " + punct;
    punct = punct.replace(/ /g, "|");
    var punct_pattern = new RegExp(punct);
    var line_starters = "continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export".split(",");
    var reserved_words = line_starters.concat(["do", "in", "of", "else", "get", "set", "new", "catch", "finally", "typeof", "yield", "async", "await", "from", "as", "class", "extends"]);
    var reserved_word_pattern = new RegExp("^(?:" + reserved_words.join("|") + ")$");
    var in_html_comment;
    var Tokenizer = function(input_string, options) {
      BaseTokenizer.call(this, input_string, options);
      this._patterns.whitespace = this._patterns.whitespace.matching(
        /\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff/.source,
        /\u2028\u2029/.source
      );
      var pattern_reader = new Pattern(this._input);
      var templatable = new TemplatablePattern(this._input).read_options(this._options);
      this.__patterns = {
        template: templatable,
        identifier: templatable.starting_with(acorn.identifier).matching(acorn.identifierMatch),
        number: pattern_reader.matching(number_pattern),
        punct: pattern_reader.matching(punct_pattern),
        // comment ends just before nearest linefeed or end of file
        comment: pattern_reader.starting_with(/\/\//).until(/[\n\r\u2028\u2029]/),
        //  /* ... */ comment ends with nearest */ or end of file
        block_comment: pattern_reader.starting_with(/\/\*/).until_after(/\*\//),
        html_comment_start: pattern_reader.matching(/<!--/),
        html_comment_end: pattern_reader.matching(/-->/),
        include: pattern_reader.starting_with(/#include/).until_after(acorn.lineBreak),
        shebang: pattern_reader.starting_with(/#!/).until_after(acorn.lineBreak),
        xml: pattern_reader.matching(/[\s\S]*?<(\/?)([-a-zA-Z:0-9_.]+|{[^}]+?}|!\[CDATA\[[^\]]*?\]\]|)(\s*{[^}]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{([^{}]|{[^}]+?})+?}))*\s*(\/?)\s*>/),
        single_quote: templatable.until(/['\\\n\r\u2028\u2029]/),
        double_quote: templatable.until(/["\\\n\r\u2028\u2029]/),
        template_text: templatable.until(/[`\\$]/),
        template_expression: templatable.until(/[`}\\]/)
      };
    };
    Tokenizer.prototype = new BaseTokenizer();
    Tokenizer.prototype._is_comment = function(current_token) {
      return current_token.type === TOKEN.COMMENT || current_token.type === TOKEN.BLOCK_COMMENT || current_token.type === TOKEN.UNKNOWN;
    };
    Tokenizer.prototype._is_opening = function(current_token) {
      return current_token.type === TOKEN.START_BLOCK || current_token.type === TOKEN.START_EXPR;
    };
    Tokenizer.prototype._is_closing = function(current_token, open_token) {
      return (current_token.type === TOKEN.END_BLOCK || current_token.type === TOKEN.END_EXPR) && (open_token && (current_token.text === "]" && open_token.text === "[" || current_token.text === ")" && open_token.text === "(" || current_token.text === "}" && open_token.text === "{"));
    };
    Tokenizer.prototype._reset = function() {
      in_html_comment = false;
    };
    Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
      var token = null;
      this._readWhitespace();
      var c = this._input.peek();
      if (c === null) {
        return this._create_token(TOKEN.EOF, "");
      }
      token = token || this._read_non_javascript(c);
      token = token || this._read_string(c);
      token = token || this._read_pair(c, this._input.peek(1));
      token = token || this._read_word(previous_token);
      token = token || this._read_singles(c);
      token = token || this._read_comment(c);
      token = token || this._read_regexp(c, previous_token);
      token = token || this._read_xml(c, previous_token);
      token = token || this._read_punctuation();
      token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
      return token;
    };
    Tokenizer.prototype._read_word = function(previous_token) {
      var resulting_string;
      resulting_string = this.__patterns.identifier.read();
      if (resulting_string !== "") {
        resulting_string = resulting_string.replace(acorn.allLineBreaks, "\n");
        if (!(previous_token.type === TOKEN.DOT || previous_token.type === TOKEN.RESERVED && (previous_token.text === "set" || previous_token.text === "get")) && reserved_word_pattern.test(resulting_string)) {
          if ((resulting_string === "in" || resulting_string === "of") && (previous_token.type === TOKEN.WORD || previous_token.type === TOKEN.STRING)) {
            return this._create_token(TOKEN.OPERATOR, resulting_string);
          }
          return this._create_token(TOKEN.RESERVED, resulting_string);
        }
        return this._create_token(TOKEN.WORD, resulting_string);
      }
      resulting_string = this.__patterns.number.read();
      if (resulting_string !== "") {
        return this._create_token(TOKEN.WORD, resulting_string);
      }
    };
    Tokenizer.prototype._read_singles = function(c) {
      var token = null;
      if (c === "(" || c === "[") {
        token = this._create_token(TOKEN.START_EXPR, c);
      } else if (c === ")" || c === "]") {
        token = this._create_token(TOKEN.END_EXPR, c);
      } else if (c === "{") {
        token = this._create_token(TOKEN.START_BLOCK, c);
      } else if (c === "}") {
        token = this._create_token(TOKEN.END_BLOCK, c);
      } else if (c === ";") {
        token = this._create_token(TOKEN.SEMICOLON, c);
      } else if (c === "." && dot_pattern.test(this._input.peek(1))) {
        token = this._create_token(TOKEN.DOT, c);
      } else if (c === ",") {
        token = this._create_token(TOKEN.COMMA, c);
      }
      if (token) {
        this._input.next();
      }
      return token;
    };
    Tokenizer.prototype._read_pair = function(c, d) {
      var token = null;
      if (c === "#" && d === "{") {
        token = this._create_token(TOKEN.START_BLOCK, c + d);
      }
      if (token) {
        this._input.next();
        this._input.next();
      }
      return token;
    };
    Tokenizer.prototype._read_punctuation = function() {
      var resulting_string = this.__patterns.punct.read();
      if (resulting_string !== "") {
        if (resulting_string === "=") {
          return this._create_token(TOKEN.EQUALS, resulting_string);
        } else if (resulting_string === "?.") {
          return this._create_token(TOKEN.DOT, resulting_string);
        } else {
          return this._create_token(TOKEN.OPERATOR, resulting_string);
        }
      }
    };
    Tokenizer.prototype._read_non_javascript = function(c) {
      var resulting_string = "";
      if (c === "#") {
        if (this._is_first_token()) {
          resulting_string = this.__patterns.shebang.read();
          if (resulting_string) {
            return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + "\n");
          }
        }
        resulting_string = this.__patterns.include.read();
        if (resulting_string) {
          return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + "\n");
        }
        c = this._input.next();
        var sharp = "#";
        if (this._input.hasNext() && this._input.testChar(digit)) {
          do {
            c = this._input.next();
            sharp += c;
          } while (this._input.hasNext() && c !== "#" && c !== "=");
          if (c === "#") {
          } else if (this._input.peek() === "[" && this._input.peek(1) === "]") {
            sharp += "[]";
            this._input.next();
            this._input.next();
          } else if (this._input.peek() === "{" && this._input.peek(1) === "}") {
            sharp += "{}";
            this._input.next();
            this._input.next();
          }
          return this._create_token(TOKEN.WORD, sharp);
        }
        this._input.back();
      } else if (c === "<" && this._is_first_token()) {
        resulting_string = this.__patterns.html_comment_start.read();
        if (resulting_string) {
          while (this._input.hasNext() && !this._input.testChar(acorn.newline)) {
            resulting_string += this._input.next();
          }
          in_html_comment = true;
          return this._create_token(TOKEN.COMMENT, resulting_string);
        }
      } else if (in_html_comment && c === "-") {
        resulting_string = this.__patterns.html_comment_end.read();
        if (resulting_string) {
          in_html_comment = false;
          return this._create_token(TOKEN.COMMENT, resulting_string);
        }
      }
      return null;
    };
    Tokenizer.prototype._read_comment = function(c) {
      var token = null;
      if (c === "/") {
        var comment = "";
        if (this._input.peek(1) === "*") {
          comment = this.__patterns.block_comment.read();
          var directives = directives_core.get_directives(comment);
          if (directives && directives.ignore === "start") {
            comment += directives_core.readIgnored(this._input);
          }
          comment = comment.replace(acorn.allLineBreaks, "\n");
          token = this._create_token(TOKEN.BLOCK_COMMENT, comment);
          token.directives = directives;
        } else if (this._input.peek(1) === "/") {
          comment = this.__patterns.comment.read();
          token = this._create_token(TOKEN.COMMENT, comment);
        }
      }
      return token;
    };
    Tokenizer.prototype._read_string = function(c) {
      if (c === "`" || c === "'" || c === '"') {
        var resulting_string = this._input.next();
        this.has_char_escapes = false;
        if (c === "`") {
          resulting_string += this._read_string_recursive("`", true, "${");
        } else {
          resulting_string += this._read_string_recursive(c);
        }
        if (this.has_char_escapes && this._options.unescape_strings) {
          resulting_string = unescape_string(resulting_string);
        }
        if (this._input.peek() === c) {
          resulting_string += this._input.next();
        }
        resulting_string = resulting_string.replace(acorn.allLineBreaks, "\n");
        return this._create_token(TOKEN.STRING, resulting_string);
      }
      return null;
    };
    Tokenizer.prototype._allow_regexp_or_xml = function(previous_token) {
      return previous_token.type === TOKEN.RESERVED && in_array(previous_token.text, ["return", "case", "throw", "else", "do", "typeof", "yield"]) || previous_token.type === TOKEN.END_EXPR && previous_token.text === ")" && previous_token.opened.previous.type === TOKEN.RESERVED && in_array(previous_token.opened.previous.text, ["if", "while", "for"]) || in_array(previous_token.type, [
        TOKEN.COMMENT,
        TOKEN.START_EXPR,
        TOKEN.START_BLOCK,
        TOKEN.START,
        TOKEN.END_BLOCK,
        TOKEN.OPERATOR,
        TOKEN.EQUALS,
        TOKEN.EOF,
        TOKEN.SEMICOLON,
        TOKEN.COMMA
      ]);
    };
    Tokenizer.prototype._read_regexp = function(c, previous_token) {
      if (c === "/" && this._allow_regexp_or_xml(previous_token)) {
        var resulting_string = this._input.next();
        var esc = false;
        var in_char_class = false;
        while (this._input.hasNext() && ((esc || in_char_class || this._input.peek() !== c) && !this._input.testChar(acorn.newline))) {
          resulting_string += this._input.peek();
          if (!esc) {
            esc = this._input.peek() === "\\";
            if (this._input.peek() === "[") {
              in_char_class = true;
            } else if (this._input.peek() === "]") {
              in_char_class = false;
            }
          } else {
            esc = false;
          }
          this._input.next();
        }
        if (this._input.peek() === c) {
          resulting_string += this._input.next();
          resulting_string += this._input.read(acorn.identifier);
        }
        return this._create_token(TOKEN.STRING, resulting_string);
      }
      return null;
    };
    Tokenizer.prototype._read_xml = function(c, previous_token) {
      if (this._options.e4x && c === "<" && this._allow_regexp_or_xml(previous_token)) {
        var xmlStr = "";
        var match = this.__patterns.xml.read_match();
        if (match) {
          var rootTag = match[2].replace(/^{\s+/, "{").replace(/\s+}$/, "}");
          var isCurlyRoot = rootTag.indexOf("{") === 0;
          var depth = 0;
          while (match) {
            var isEndTag = !!match[1];
            var tagName = match[2];
            var isSingletonTag = !!match[match.length - 1] || tagName.slice(0, 8) === "![CDATA[";
            if (!isSingletonTag && (tagName === rootTag || isCurlyRoot && tagName.replace(/^{\s+/, "{").replace(/\s+}$/, "}"))) {
              if (isEndTag) {
                --depth;
              } else {
                ++depth;
              }
            }
            xmlStr += match[0];
            if (depth <= 0) {
              break;
            }
            match = this.__patterns.xml.read_match();
          }
          if (!match) {
            xmlStr += this._input.match(/[\s\S]*/g)[0];
          }
          xmlStr = xmlStr.replace(acorn.allLineBreaks, "\n");
          return this._create_token(TOKEN.STRING, xmlStr);
        }
      }
      return null;
    };
    function unescape_string(s) {
      var out = "", escaped = 0;
      var input_scan = new InputScanner(s);
      var matched = null;
      while (input_scan.hasNext()) {
        matched = input_scan.match(/([\s]|[^\\]|\\\\)+/g);
        if (matched) {
          out += matched[0];
        }
        if (input_scan.peek() === "\\") {
          input_scan.next();
          if (input_scan.peek() === "x") {
            matched = input_scan.match(/x([0-9A-Fa-f]{2})/g);
          } else if (input_scan.peek() === "u") {
            matched = input_scan.match(/u([0-9A-Fa-f]{4})/g);
            if (!matched) {
              matched = input_scan.match(/u\{([0-9A-Fa-f]+)\}/g);
            }
          } else {
            out += "\\";
            if (input_scan.hasNext()) {
              out += input_scan.next();
            }
            continue;
          }
          if (!matched) {
            return s;
          }
          escaped = parseInt(matched[1], 16);
          if (escaped > 126 && escaped <= 255 && matched[0].indexOf("x") === 0) {
            return s;
          } else if (escaped >= 0 && escaped < 32) {
            out += "\\" + matched[0];
          } else if (escaped > 1114111) {
            out += "\\" + matched[0];
          } else if (escaped === 34 || escaped === 39 || escaped === 92) {
            out += "\\" + String.fromCharCode(escaped);
          } else {
            out += String.fromCharCode(escaped);
          }
        }
      }
      return out;
    }
    Tokenizer.prototype._read_string_recursive = function(delimiter, allow_unescaped_newlines, start_sub) {
      var current_char;
      var pattern;
      if (delimiter === "'") {
        pattern = this.__patterns.single_quote;
      } else if (delimiter === '"') {
        pattern = this.__patterns.double_quote;
      } else if (delimiter === "`") {
        pattern = this.__patterns.template_text;
      } else if (delimiter === "}") {
        pattern = this.__patterns.template_expression;
      }
      var resulting_string = pattern.read();
      var next = "";
      while (this._input.hasNext()) {
        next = this._input.next();
        if (next === delimiter || !allow_unescaped_newlines && acorn.newline.test(next)) {
          this._input.back();
          break;
        } else if (next === "\\" && this._input.hasNext()) {
          current_char = this._input.peek();
          if (current_char === "x" || current_char === "u") {
            this.has_char_escapes = true;
          } else if (current_char === "\r" && this._input.peek(1) === "\n") {
            this._input.next();
          }
          next += this._input.next();
        } else if (start_sub) {
          if (start_sub === "${" && next === "$" && this._input.peek() === "{") {
            next += this._input.next();
          }
          if (start_sub === next) {
            if (delimiter === "`") {
              next += this._read_string_recursive("}", allow_unescaped_newlines, "`");
            } else {
              next += this._read_string_recursive("`", allow_unescaped_newlines, "${");
            }
            if (this._input.hasNext()) {
              next += this._input.next();
            }
          }
        }
        next += pattern.read();
        resulting_string += next;
      }
      return resulting_string;
    };
    module2.exports.Tokenizer = Tokenizer;
    module2.exports.TOKEN = TOKEN;
    module2.exports.positionable_operators = positionable_operators.slice();
    module2.exports.line_starters = line_starters.slice();
  }
});

// node_modules/js-beautify/js/src/javascript/beautifier.js
var require_beautifier = __commonJS({
  "node_modules/js-beautify/js/src/javascript/beautifier.js"(exports2, module2) {
    "use strict";
    var Output = require_output().Output;
    var Token = require_token().Token;
    var acorn = require_acorn();
    var Options = require_options2().Options;
    var Tokenizer = require_tokenizer2().Tokenizer;
    var line_starters = require_tokenizer2().line_starters;
    var positionable_operators = require_tokenizer2().positionable_operators;
    var TOKEN = require_tokenizer2().TOKEN;
    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }
    function ltrim(s) {
      return s.replace(/^\s+/g, "");
    }
    function generateMapFromStrings(list) {
      var result = {};
      for (var x = 0; x < list.length; x++) {
        result[list[x].replace(/-/g, "_")] = list[x];
      }
      return result;
    }
    function reserved_word(token, word) {
      return token && token.type === TOKEN.RESERVED && token.text === word;
    }
    function reserved_array(token, words) {
      return token && token.type === TOKEN.RESERVED && in_array(token.text, words);
    }
    var special_words = ["case", "return", "do", "if", "throw", "else", "await", "break", "continue", "async"];
    var validPositionValues = ["before-newline", "after-newline", "preserve-newline"];
    var OPERATOR_POSITION = generateMapFromStrings(validPositionValues);
    var OPERATOR_POSITION_BEFORE_OR_PRESERVE = [OPERATOR_POSITION.before_newline, OPERATOR_POSITION.preserve_newline];
    var MODE = {
      BlockStatement: "BlockStatement",
      // 'BLOCK'
      Statement: "Statement",
      // 'STATEMENT'
      ObjectLiteral: "ObjectLiteral",
      // 'OBJECT',
      ArrayLiteral: "ArrayLiteral",
      //'[EXPRESSION]',
      ForInitializer: "ForInitializer",
      //'(FOR-EXPRESSION)',
      Conditional: "Conditional",
      //'(COND-EXPRESSION)',
      Expression: "Expression"
      //'(EXPRESSION)'
    };
    function remove_redundant_indentation(output, frame) {
      if (frame.multiline_frame || frame.mode === MODE.ForInitializer || frame.mode === MODE.Conditional) {
        return;
      }
      output.remove_indent(frame.start_line_index);
    }
    function split_linebreaks(s) {
      s = s.replace(acorn.allLineBreaks, "\n");
      var out = [], idx = s.indexOf("\n");
      while (idx !== -1) {
        out.push(s.substring(0, idx));
        s = s.substring(idx + 1);
        idx = s.indexOf("\n");
      }
      if (s.length) {
        out.push(s);
      }
      return out;
    }
    function is_array(mode) {
      return mode === MODE.ArrayLiteral;
    }
    function is_expression(mode) {
      return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
    }
    function all_lines_start_with(lines, c) {
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.charAt(0) !== c) {
          return false;
        }
      }
      return true;
    }
    function each_line_matches_indent(lines, indent) {
      var i = 0, len = lines.length, line;
      for (; i < len; i++) {
        line = lines[i];
        if (line && line.indexOf(indent) !== 0) {
          return false;
        }
      }
      return true;
    }
    function Beautifier(source_text, options) {
      options = options || {};
      this._source_text = source_text || "";
      this._output = null;
      this._tokens = null;
      this._last_last_text = null;
      this._flags = null;
      this._previous_flags = null;
      this._flag_store = null;
      this._options = new Options(options);
    }
    Beautifier.prototype.create_flags = function(flags_base, mode) {
      var next_indent_level = 0;
      if (flags_base) {
        next_indent_level = flags_base.indentation_level;
        if (!this._output.just_added_newline() && flags_base.line_indent_level > next_indent_level) {
          next_indent_level = flags_base.line_indent_level;
        }
      }
      var next_flags = {
        mode,
        parent: flags_base,
        last_token: flags_base ? flags_base.last_token : new Token(TOKEN.START_BLOCK, ""),
        // last token text
        last_word: flags_base ? flags_base.last_word : "",
        // last TOKEN.WORD passed
        declaration_statement: false,
        declaration_assignment: false,
        multiline_frame: false,
        inline_frame: false,
        if_block: false,
        else_block: false,
        class_start_block: false,
        // class A { INSIDE HERE } or class B extends C { INSIDE HERE }
        do_block: false,
        do_while: false,
        import_block: false,
        in_case_statement: false,
        // switch(..){ INSIDE HERE }
        in_case: false,
        // we're on the exact line with "case 0:"
        case_body: false,
        // the indented case-action block
        case_block: false,
        // the indented case-action block is wrapped with {}
        indentation_level: next_indent_level,
        alignment: 0,
        line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
        start_line_index: this._output.get_line_number(),
        ternary_depth: 0
      };
      return next_flags;
    };
    Beautifier.prototype._reset = function(source_text) {
      var baseIndentString = source_text.match(/^[\t ]*/)[0];
      this._last_last_text = "";
      this._output = new Output(this._options, baseIndentString);
      this._output.raw = this._options.test_output_raw;
      this._flag_store = [];
      this.set_mode(MODE.BlockStatement);
      var tokenizer = new Tokenizer(source_text, this._options);
      this._tokens = tokenizer.tokenize();
      return source_text;
    };
    Beautifier.prototype.beautify = function() {
      if (this._options.disabled) {
        return this._source_text;
      }
      var sweet_code;
      var source_text = this._reset(this._source_text);
      var eol = this._options.eol;
      if (this._options.eol === "auto") {
        eol = "\n";
        if (source_text && acorn.lineBreak.test(source_text || "")) {
          eol = source_text.match(acorn.lineBreak)[0];
        }
      }
      var current_token = this._tokens.next();
      while (current_token) {
        this.handle_token(current_token);
        this._last_last_text = this._flags.last_token.text;
        this._flags.last_token = current_token;
        current_token = this._tokens.next();
      }
      sweet_code = this._output.get_code(eol);
      return sweet_code;
    };
    Beautifier.prototype.handle_token = function(current_token, preserve_statement_flags) {
      if (current_token.type === TOKEN.START_EXPR) {
        this.handle_start_expr(current_token);
      } else if (current_token.type === TOKEN.END_EXPR) {
        this.handle_end_expr(current_token);
      } else if (current_token.type === TOKEN.START_BLOCK) {
        this.handle_start_block(current_token);
      } else if (current_token.type === TOKEN.END_BLOCK) {
        this.handle_end_block(current_token);
      } else if (current_token.type === TOKEN.WORD) {
        this.handle_word(current_token);
      } else if (current_token.type === TOKEN.RESERVED) {
        this.handle_word(current_token);
      } else if (current_token.type === TOKEN.SEMICOLON) {
        this.handle_semicolon(current_token);
      } else if (current_token.type === TOKEN.STRING) {
        this.handle_string(current_token);
      } else if (current_token.type === TOKEN.EQUALS) {
        this.handle_equals(current_token);
      } else if (current_token.type === TOKEN.OPERATOR) {
        this.handle_operator(current_token);
      } else if (current_token.type === TOKEN.COMMA) {
        this.handle_comma(current_token);
      } else if (current_token.type === TOKEN.BLOCK_COMMENT) {
        this.handle_block_comment(current_token, preserve_statement_flags);
      } else if (current_token.type === TOKEN.COMMENT) {
        this.handle_comment(current_token, preserve_statement_flags);
      } else if (current_token.type === TOKEN.DOT) {
        this.handle_dot(current_token);
      } else if (current_token.type === TOKEN.EOF) {
        this.handle_eof(current_token);
      } else if (current_token.type === TOKEN.UNKNOWN) {
        this.handle_unknown(current_token, preserve_statement_flags);
      } else {
        this.handle_unknown(current_token, preserve_statement_flags);
      }
    };
    Beautifier.prototype.handle_whitespace_and_comments = function(current_token, preserve_statement_flags) {
      var newlines = current_token.newlines;
      var keep_whitespace = this._options.keep_array_indentation && is_array(this._flags.mode);
      if (current_token.comments_before) {
        var comment_token = current_token.comments_before.next();
        while (comment_token) {
          this.handle_whitespace_and_comments(comment_token, preserve_statement_flags);
          this.handle_token(comment_token, preserve_statement_flags);
          comment_token = current_token.comments_before.next();
        }
      }
      if (keep_whitespace) {
        for (var i = 0; i < newlines; i += 1) {
          this.print_newline(i > 0, preserve_statement_flags);
        }
      } else {
        if (this._options.max_preserve_newlines && newlines > this._options.max_preserve_newlines) {
          newlines = this._options.max_preserve_newlines;
        }
        if (this._options.preserve_newlines) {
          if (newlines > 1) {
            this.print_newline(false, preserve_statement_flags);
            for (var j = 1; j < newlines; j += 1) {
              this.print_newline(true, preserve_statement_flags);
            }
          }
        }
      }
    };
    var newline_restricted_tokens = ["async", "break", "continue", "return", "throw", "yield"];
    Beautifier.prototype.allow_wrap_or_preserved_newline = function(current_token, force_linewrap) {
      force_linewrap = force_linewrap === void 0 ? false : force_linewrap;
      if (this._output.just_added_newline()) {
        return;
      }
      var shouldPreserveOrForce = this._options.preserve_newlines && current_token.newlines || force_linewrap;
      var operatorLogicApplies = in_array(this._flags.last_token.text, positionable_operators) || in_array(current_token.text, positionable_operators);
      if (operatorLogicApplies) {
        var shouldPrintOperatorNewline = in_array(this._flags.last_token.text, positionable_operators) && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE) || in_array(current_token.text, positionable_operators);
        shouldPreserveOrForce = shouldPreserveOrForce && shouldPrintOperatorNewline;
      }
      if (shouldPreserveOrForce) {
        this.print_newline(false, true);
      } else if (this._options.wrap_line_length) {
        if (reserved_array(this._flags.last_token, newline_restricted_tokens)) {
          return;
        }
        this._output.set_wrap_point();
      }
    };
    Beautifier.prototype.print_newline = function(force_newline, preserve_statement_flags) {
      if (!preserve_statement_flags) {
        if (this._flags.last_token.text !== ";" && this._flags.last_token.text !== "," && this._flags.last_token.text !== "=" && (this._flags.last_token.type !== TOKEN.OPERATOR || this._flags.last_token.text === "--" || this._flags.last_token.text === "++")) {
          var next_token = this._tokens.peek();
          while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, "else")) && !this._flags.do_block) {
            this.restore_mode();
          }
        }
      }
      if (this._output.add_new_line(force_newline)) {
        this._flags.multiline_frame = true;
      }
    };
    Beautifier.prototype.print_token_line_indentation = function(current_token) {
      if (this._output.just_added_newline()) {
        if (this._options.keep_array_indentation && current_token.newlines && (current_token.text === "[" || is_array(this._flags.mode))) {
          this._output.current_line.set_indent(-1);
          this._output.current_line.push(current_token.whitespace_before);
          this._output.space_before_token = false;
        } else if (this._output.set_indent(this._flags.indentation_level, this._flags.alignment)) {
          this._flags.line_indent_level = this._flags.indentation_level;
        }
      }
    };
    Beautifier.prototype.print_token = function(current_token) {
      if (this._output.raw) {
        this._output.add_raw_token(current_token);
        return;
      }
      if (this._options.comma_first && current_token.previous && current_token.previous.type === TOKEN.COMMA && this._output.just_added_newline()) {
        if (this._output.previous_line.last() === ",") {
          var popped = this._output.previous_line.pop();
          if (this._output.previous_line.is_empty()) {
            this._output.previous_line.push(popped);
            this._output.trim(true);
            this._output.current_line.pop();
            this._output.trim();
          }
          this.print_token_line_indentation(current_token);
          this._output.add_token(",");
          this._output.space_before_token = true;
        }
      }
      this.print_token_line_indentation(current_token);
      this._output.non_breaking_space = true;
      this._output.add_token(current_token.text);
      if (this._output.previous_token_wrapped) {
        this._flags.multiline_frame = true;
      }
    };
    Beautifier.prototype.indent = function() {
      this._flags.indentation_level += 1;
      this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
    };
    Beautifier.prototype.deindent = function() {
      if (this._flags.indentation_level > 0 && (!this._flags.parent || this._flags.indentation_level > this._flags.parent.indentation_level)) {
        this._flags.indentation_level -= 1;
        this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
      }
    };
    Beautifier.prototype.set_mode = function(mode) {
      if (this._flags) {
        this._flag_store.push(this._flags);
        this._previous_flags = this._flags;
      } else {
        this._previous_flags = this.create_flags(null, mode);
      }
      this._flags = this.create_flags(this._previous_flags, mode);
      this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
    };
    Beautifier.prototype.restore_mode = function() {
      if (this._flag_store.length > 0) {
        this._previous_flags = this._flags;
        this._flags = this._flag_store.pop();
        if (this._previous_flags.mode === MODE.Statement) {
          remove_redundant_indentation(this._output, this._previous_flags);
        }
        this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
      }
    };
    Beautifier.prototype.start_of_object_property = function() {
      return this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ["get", "set"]));
    };
    Beautifier.prototype.start_of_statement = function(current_token) {
      var start = false;
      start = start || reserved_array(this._flags.last_token, ["var", "let", "const"]) && current_token.type === TOKEN.WORD;
      start = start || reserved_word(this._flags.last_token, "do");
      start = start || !(this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement) && reserved_array(this._flags.last_token, newline_restricted_tokens) && !current_token.newlines;
      start = start || reserved_word(this._flags.last_token, "else") && !(reserved_word(current_token, "if") && !current_token.comments_before);
      start = start || this._flags.last_token.type === TOKEN.END_EXPR && (this._previous_flags.mode === MODE.ForInitializer || this._previous_flags.mode === MODE.Conditional);
      start = start || this._flags.last_token.type === TOKEN.WORD && this._flags.mode === MODE.BlockStatement && !this._flags.in_case && !(current_token.text === "--" || current_token.text === "++") && this._last_last_text !== "function" && current_token.type !== TOKEN.WORD && current_token.type !== TOKEN.RESERVED;
      start = start || this._flags.mode === MODE.ObjectLiteral && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ["get", "set"]));
      if (start) {
        this.set_mode(MODE.Statement);
        this.indent();
        this.handle_whitespace_and_comments(current_token, true);
        if (!this.start_of_object_property()) {
          this.allow_wrap_or_preserved_newline(
            current_token,
            reserved_array(current_token, ["do", "for", "if", "while"])
          );
        }
        return true;
      }
      return false;
    };
    Beautifier.prototype.handle_start_expr = function(current_token) {
      if (!this.start_of_statement(current_token)) {
        this.handle_whitespace_and_comments(current_token);
      }
      var next_mode = MODE.Expression;
      if (current_token.text === "[") {
        if (this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === ")") {
          if (reserved_array(this._flags.last_token, line_starters)) {
            this._output.space_before_token = true;
          }
          this.print_token(current_token);
          this.set_mode(next_mode);
          this.indent();
          if (this._options.space_in_paren) {
            this._output.space_before_token = true;
          }
          return;
        }
        next_mode = MODE.ArrayLiteral;
        if (is_array(this._flags.mode)) {
          if (this._flags.last_token.text === "[" || this._flags.last_token.text === "," && (this._last_last_text === "]" || this._last_last_text === "}")) {
            if (!this._options.keep_array_indentation) {
              this.print_newline();
            }
          }
        }
        if (!in_array(this._flags.last_token.type, [TOKEN.START_EXPR, TOKEN.END_EXPR, TOKEN.WORD, TOKEN.OPERATOR, TOKEN.DOT])) {
          this._output.space_before_token = true;
        }
      } else {
        if (this._flags.last_token.type === TOKEN.RESERVED) {
          if (this._flags.last_token.text === "for") {
            this._output.space_before_token = this._options.space_before_conditional;
            next_mode = MODE.ForInitializer;
          } else if (in_array(this._flags.last_token.text, ["if", "while", "switch"])) {
            this._output.space_before_token = this._options.space_before_conditional;
            next_mode = MODE.Conditional;
          } else if (in_array(this._flags.last_word, ["await", "async"])) {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.text === "import" && current_token.whitespace_before === "") {
            this._output.space_before_token = false;
          } else if (in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === "catch") {
            this._output.space_before_token = true;
          }
        } else if (this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
          if (!this.start_of_object_property()) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        } else if (this._flags.last_token.type === TOKEN.WORD) {
          this._output.space_before_token = false;
          var peek_back_two = this._tokens.peek(-3);
          if (this._options.space_after_named_function && peek_back_two) {
            var peek_back_three = this._tokens.peek(-4);
            if (reserved_array(peek_back_two, ["async", "function"]) || peek_back_two.text === "*" && reserved_array(peek_back_three, ["async", "function"])) {
              this._output.space_before_token = true;
            } else if (this._flags.mode === MODE.ObjectLiteral) {
              if (peek_back_two.text === "{" || peek_back_two.text === "," || peek_back_two.text === "*" && (peek_back_three.text === "{" || peek_back_three.text === ",")) {
                this._output.space_before_token = true;
              }
            } else if (this._flags.parent && this._flags.parent.class_start_block) {
              this._output.space_before_token = true;
            }
          }
        } else {
          this.allow_wrap_or_preserved_newline(current_token);
        }
        if (this._flags.last_token.type === TOKEN.RESERVED && (this._flags.last_word === "function" || this._flags.last_word === "typeof") || this._flags.last_token.text === "*" && (in_array(this._last_last_text, ["function", "yield"]) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ["{", ","]))) {
          this._output.space_before_token = this._options.space_after_anon_function;
        }
      }
      if (this._flags.last_token.text === ";" || this._flags.last_token.type === TOKEN.START_BLOCK) {
        this.print_newline();
      } else if (this._flags.last_token.type === TOKEN.END_EXPR || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.END_BLOCK || this._flags.last_token.text === "." || this._flags.last_token.type === TOKEN.COMMA) {
        this.allow_wrap_or_preserved_newline(current_token, current_token.newlines);
      }
      this.print_token(current_token);
      this.set_mode(next_mode);
      if (this._options.space_in_paren) {
        this._output.space_before_token = true;
      }
      this.indent();
    };
    Beautifier.prototype.handle_end_expr = function(current_token) {
      while (this._flags.mode === MODE.Statement) {
        this.restore_mode();
      }
      this.handle_whitespace_and_comments(current_token);
      if (this._flags.multiline_frame) {
        this.allow_wrap_or_preserved_newline(
          current_token,
          current_token.text === "]" && is_array(this._flags.mode) && !this._options.keep_array_indentation
        );
      }
      if (this._options.space_in_paren) {
        if (this._flags.last_token.type === TOKEN.START_EXPR && !this._options.space_in_empty_paren) {
          this._output.trim();
          this._output.space_before_token = false;
        } else {
          this._output.space_before_token = true;
        }
      }
      this.deindent();
      this.print_token(current_token);
      this.restore_mode();
      remove_redundant_indentation(this._output, this._previous_flags);
      if (this._flags.do_while && this._previous_flags.mode === MODE.Conditional) {
        this._previous_flags.mode = MODE.Expression;
        this._flags.do_block = false;
        this._flags.do_while = false;
      }
    };
    Beautifier.prototype.handle_start_block = function(current_token) {
      this.handle_whitespace_and_comments(current_token);
      var next_token = this._tokens.peek();
      var second_token = this._tokens.peek(1);
      if (this._flags.last_word === "switch" && this._flags.last_token.type === TOKEN.END_EXPR) {
        this.set_mode(MODE.BlockStatement);
        this._flags.in_case_statement = true;
      } else if (this._flags.case_body) {
        this.set_mode(MODE.BlockStatement);
      } else if (second_token && (in_array(second_token.text, [":", ","]) && in_array(next_token.type, [TOKEN.STRING, TOKEN.WORD, TOKEN.RESERVED]) || in_array(next_token.text, ["get", "set", "..."]) && in_array(second_token.type, [TOKEN.WORD, TOKEN.RESERVED]))) {
        if (in_array(this._last_last_text, ["class", "interface"]) && !in_array(second_token.text, [":", ","])) {
          this.set_mode(MODE.BlockStatement);
        } else {
          this.set_mode(MODE.ObjectLiteral);
        }
      } else if (this._flags.last_token.type === TOKEN.OPERATOR && this._flags.last_token.text === "=>") {
        this.set_mode(MODE.BlockStatement);
      } else if (in_array(this._flags.last_token.type, [TOKEN.EQUALS, TOKEN.START_EXPR, TOKEN.COMMA, TOKEN.OPERATOR]) || reserved_array(this._flags.last_token, ["return", "throw", "import", "default"])) {
        this.set_mode(MODE.ObjectLiteral);
      } else {
        this.set_mode(MODE.BlockStatement);
      }
      if (this._flags.last_token) {
        if (reserved_array(this._flags.last_token.previous, ["class", "extends"])) {
          this._flags.class_start_block = true;
        }
      }
      var empty_braces = !next_token.comments_before && next_token.text === "}";
      var empty_anonymous_function = empty_braces && this._flags.last_word === "function" && this._flags.last_token.type === TOKEN.END_EXPR;
      if (this._options.brace_preserve_inline) {
        var index = 0;
        var check_token = null;
        this._flags.inline_frame = true;
        do {
          index += 1;
          check_token = this._tokens.peek(index - 1);
          if (check_token.newlines) {
            this._flags.inline_frame = false;
            break;
          }
        } while (check_token.type !== TOKEN.EOF && !(check_token.type === TOKEN.END_BLOCK && check_token.opened === current_token));
      }
      if ((this._options.brace_style === "expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
        if (this._flags.last_token.type !== TOKEN.OPERATOR && (empty_anonymous_function || this._flags.last_token.type === TOKEN.EQUALS || reserved_array(this._flags.last_token, special_words) && this._flags.last_token.text !== "else")) {
          this._output.space_before_token = true;
        } else {
          this.print_newline(false, true);
        }
      } else {
        if (is_array(this._previous_flags.mode) && (this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.COMMA)) {
          if (this._flags.last_token.type === TOKEN.COMMA || this._options.space_in_paren) {
            this._output.space_before_token = true;
          }
          if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR && this._flags.inline_frame) {
            this.allow_wrap_or_preserved_newline(current_token);
            this._previous_flags.multiline_frame = this._previous_flags.multiline_frame || this._flags.multiline_frame;
            this._flags.multiline_frame = false;
          }
        }
        if (this._flags.last_token.type !== TOKEN.OPERATOR && this._flags.last_token.type !== TOKEN.START_EXPR) {
          if (in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.SEMICOLON]) && !this._flags.inline_frame) {
            this.print_newline();
          } else {
            this._output.space_before_token = true;
          }
        }
      }
      this.print_token(current_token);
      this.indent();
      if (!empty_braces && !(this._options.brace_preserve_inline && this._flags.inline_frame)) {
        this.print_newline();
      }
    };
    Beautifier.prototype.handle_end_block = function(current_token) {
      this.handle_whitespace_and_comments(current_token);
      while (this._flags.mode === MODE.Statement) {
        this.restore_mode();
      }
      var empty_braces = this._flags.last_token.type === TOKEN.START_BLOCK;
      if (this._flags.inline_frame && !empty_braces) {
        this._output.space_before_token = true;
      } else if (this._options.brace_style === "expand") {
        if (!empty_braces) {
          this.print_newline();
        }
      } else {
        if (!empty_braces) {
          if (is_array(this._flags.mode) && this._options.keep_array_indentation) {
            this._options.keep_array_indentation = false;
            this.print_newline();
            this._options.keep_array_indentation = true;
          } else {
            this.print_newline();
          }
        }
      }
      this.restore_mode();
      this.print_token(current_token);
    };
    Beautifier.prototype.handle_word = function(current_token) {
      if (current_token.type === TOKEN.RESERVED) {
        if (in_array(current_token.text, ["set", "get"]) && this._flags.mode !== MODE.ObjectLiteral) {
          current_token.type = TOKEN.WORD;
        } else if (current_token.text === "import" && in_array(this._tokens.peek().text, ["(", "."])) {
          current_token.type = TOKEN.WORD;
        } else if (in_array(current_token.text, ["as", "from"]) && !this._flags.import_block) {
          current_token.type = TOKEN.WORD;
        } else if (this._flags.mode === MODE.ObjectLiteral) {
          var next_token = this._tokens.peek();
          if (next_token.text === ":") {
            current_token.type = TOKEN.WORD;
          }
        }
      }
      if (this.start_of_statement(current_token)) {
        if (reserved_array(this._flags.last_token, ["var", "let", "const"]) && current_token.type === TOKEN.WORD) {
          this._flags.declaration_statement = true;
        }
      } else if (current_token.newlines && !is_expression(this._flags.mode) && (this._flags.last_token.type !== TOKEN.OPERATOR || (this._flags.last_token.text === "--" || this._flags.last_token.text === "++")) && this._flags.last_token.type !== TOKEN.EQUALS && (this._options.preserve_newlines || !reserved_array(this._flags.last_token, ["var", "let", "const", "set", "get"]))) {
        this.handle_whitespace_and_comments(current_token);
        this.print_newline();
      } else {
        this.handle_whitespace_and_comments(current_token);
      }
      if (this._flags.do_block && !this._flags.do_while) {
        if (reserved_word(current_token, "while")) {
          this._output.space_before_token = true;
          this.print_token(current_token);
          this._output.space_before_token = true;
          this._flags.do_while = true;
          return;
        } else {
          this.print_newline();
          this._flags.do_block = false;
        }
      }
      if (this._flags.if_block) {
        if (!this._flags.else_block && reserved_word(current_token, "else")) {
          this._flags.else_block = true;
        } else {
          while (this._flags.mode === MODE.Statement) {
            this.restore_mode();
          }
          this._flags.if_block = false;
          this._flags.else_block = false;
        }
      }
      if (this._flags.in_case_statement && reserved_array(current_token, ["case", "default"])) {
        this.print_newline();
        if (!this._flags.case_block && (this._flags.case_body || this._options.jslint_happy)) {
          this.deindent();
        }
        this._flags.case_body = false;
        this.print_token(current_token);
        this._flags.in_case = true;
        return;
      }
      if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
        if (!this.start_of_object_property() && !// start of object property is different for numeric values with +/- prefix operators
        (in_array(this._flags.last_token.text, ["+", "-"]) && this._last_last_text === ":" && this._flags.parent.mode === MODE.ObjectLiteral)) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
      }
      if (reserved_word(current_token, "function")) {
        if (in_array(this._flags.last_token.text, ["}", ";"]) || this._output.just_added_newline() && !(in_array(this._flags.last_token.text, ["(", "[", "{", ":", "=", ","]) || this._flags.last_token.type === TOKEN.OPERATOR)) {
          if (!this._output.just_added_blankline() && !current_token.comments_before) {
            this.print_newline();
            this.print_newline(true);
          }
        }
        if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD) {
          if (reserved_array(this._flags.last_token, ["get", "set", "new", "export"]) || reserved_array(this._flags.last_token, newline_restricted_tokens)) {
            this._output.space_before_token = true;
          } else if (reserved_word(this._flags.last_token, "default") && this._last_last_text === "export") {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.text === "declare") {
            this._output.space_before_token = true;
          } else {
            this.print_newline();
          }
        } else if (this._flags.last_token.type === TOKEN.OPERATOR || this._flags.last_token.text === "=") {
          this._output.space_before_token = true;
        } else if (!this._flags.multiline_frame && (is_expression(this._flags.mode) || is_array(this._flags.mode))) {
        } else {
          this.print_newline();
        }
        this.print_token(current_token);
        this._flags.last_word = current_token.text;
        return;
      }
      var prefix = "NONE";
      if (this._flags.last_token.type === TOKEN.END_BLOCK) {
        if (this._previous_flags.inline_frame) {
          prefix = "SPACE";
        } else if (!reserved_array(current_token, ["else", "catch", "finally", "from"])) {
          prefix = "NEWLINE";
        } else {
          if (this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) {
            prefix = "NEWLINE";
          } else {
            prefix = "SPACE";
            this._output.space_before_token = true;
          }
        }
      } else if (this._flags.last_token.type === TOKEN.SEMICOLON && this._flags.mode === MODE.BlockStatement) {
        prefix = "NEWLINE";
      } else if (this._flags.last_token.type === TOKEN.SEMICOLON && is_expression(this._flags.mode)) {
        prefix = "SPACE";
      } else if (this._flags.last_token.type === TOKEN.STRING) {
        prefix = "NEWLINE";
      } else if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === "*" && (in_array(this._last_last_text, ["function", "yield"]) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ["{", ","]))) {
        prefix = "SPACE";
      } else if (this._flags.last_token.type === TOKEN.START_BLOCK) {
        if (this._flags.inline_frame) {
          prefix = "SPACE";
        } else {
          prefix = "NEWLINE";
        }
      } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
        this._output.space_before_token = true;
        prefix = "NEWLINE";
      }
      if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ")") {
        if (this._flags.inline_frame || this._flags.last_token.text === "else" || this._flags.last_token.text === "export") {
          prefix = "SPACE";
        } else {
          prefix = "NEWLINE";
        }
      }
      if (reserved_array(current_token, ["else", "catch", "finally"])) {
        if ((!(this._flags.last_token.type === TOKEN.END_BLOCK && this._previous_flags.mode === MODE.BlockStatement) || this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
          this.print_newline();
        } else {
          this._output.trim(true);
          var line = this._output.current_line;
          if (line.last() !== "}") {
            this.print_newline();
          }
          this._output.space_before_token = true;
        }
      } else if (prefix === "NEWLINE") {
        if (reserved_array(this._flags.last_token, special_words)) {
          this._output.space_before_token = true;
        } else if (this._flags.last_token.text === "declare" && reserved_array(current_token, ["var", "let", "const"])) {
          this._output.space_before_token = true;
        } else if (this._flags.last_token.type !== TOKEN.END_EXPR) {
          if ((this._flags.last_token.type !== TOKEN.START_EXPR || !reserved_array(current_token, ["var", "let", "const"])) && this._flags.last_token.text !== ":") {
            if (reserved_word(current_token, "if") && reserved_word(current_token.previous, "else")) {
              this._output.space_before_token = true;
            } else {
              this.print_newline();
            }
          }
        } else if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ")") {
          this.print_newline();
        }
      } else if (this._flags.multiline_frame && is_array(this._flags.mode) && this._flags.last_token.text === "," && this._last_last_text === "}") {
        this.print_newline();
      } else if (prefix === "SPACE") {
        this._output.space_before_token = true;
      }
      if (current_token.previous && (current_token.previous.type === TOKEN.WORD || current_token.previous.type === TOKEN.RESERVED)) {
        this._output.space_before_token = true;
      }
      this.print_token(current_token);
      this._flags.last_word = current_token.text;
      if (current_token.type === TOKEN.RESERVED) {
        if (current_token.text === "do") {
          this._flags.do_block = true;
        } else if (current_token.text === "if") {
          this._flags.if_block = true;
        } else if (current_token.text === "import") {
          this._flags.import_block = true;
        } else if (this._flags.import_block && reserved_word(current_token, "from")) {
          this._flags.import_block = false;
        }
      }
    };
    Beautifier.prototype.handle_semicolon = function(current_token) {
      if (this.start_of_statement(current_token)) {
        this._output.space_before_token = false;
      } else {
        this.handle_whitespace_and_comments(current_token);
      }
      var next_token = this._tokens.peek();
      while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, "else")) && !this._flags.do_block) {
        this.restore_mode();
      }
      if (this._flags.import_block) {
        this._flags.import_block = false;
      }
      this.print_token(current_token);
    };
    Beautifier.prototype.handle_string = function(current_token) {
      if (current_token.text.startsWith("`") && current_token.newlines === 0 && current_token.whitespace_before === "" && (current_token.previous.text === ")" || this._flags.last_token.type === TOKEN.WORD)) {
      } else if (this.start_of_statement(current_token)) {
        this._output.space_before_token = true;
      } else {
        this.handle_whitespace_and_comments(current_token);
        if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.inline_frame) {
          this._output.space_before_token = true;
        } else if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
          if (!this.start_of_object_property()) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        } else if (current_token.text.startsWith("`") && this._flags.last_token.type === TOKEN.END_EXPR && (current_token.previous.text === "]" || current_token.previous.text === ")") && current_token.newlines === 0) {
          this._output.space_before_token = true;
        } else {
          this.print_newline();
        }
      }
      this.print_token(current_token);
    };
    Beautifier.prototype.handle_equals = function(current_token) {
      if (this.start_of_statement(current_token)) {
      } else {
        this.handle_whitespace_and_comments(current_token);
      }
      if (this._flags.declaration_statement) {
        this._flags.declaration_assignment = true;
      }
      this._output.space_before_token = true;
      this.print_token(current_token);
      this._output.space_before_token = true;
    };
    Beautifier.prototype.handle_comma = function(current_token) {
      this.handle_whitespace_and_comments(current_token, true);
      this.print_token(current_token);
      this._output.space_before_token = true;
      if (this._flags.declaration_statement) {
        if (is_expression(this._flags.parent.mode)) {
          this._flags.declaration_assignment = false;
        }
        if (this._flags.declaration_assignment) {
          this._flags.declaration_assignment = false;
          this.print_newline(false, true);
        } else if (this._options.comma_first) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
      } else if (this._flags.mode === MODE.ObjectLiteral || this._flags.mode === MODE.Statement && this._flags.parent.mode === MODE.ObjectLiteral) {
        if (this._flags.mode === MODE.Statement) {
          this.restore_mode();
        }
        if (!this._flags.inline_frame) {
          this.print_newline();
        }
      } else if (this._options.comma_first) {
        this.allow_wrap_or_preserved_newline(current_token);
      }
    };
    Beautifier.prototype.handle_operator = function(current_token) {
      var isGeneratorAsterisk = current_token.text === "*" && (reserved_array(this._flags.last_token, ["function", "yield"]) || in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.COMMA, TOKEN.END_BLOCK, TOKEN.SEMICOLON]));
      var isUnary = in_array(current_token.text, ["-", "+"]) && (in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.START_EXPR, TOKEN.EQUALS, TOKEN.OPERATOR]) || in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === ",");
      if (this.start_of_statement(current_token)) {
      } else {
        var preserve_statement_flags = !isGeneratorAsterisk;
        this.handle_whitespace_and_comments(current_token, preserve_statement_flags);
      }
      if (current_token.text === "*" && this._flags.last_token.type === TOKEN.DOT) {
        this.print_token(current_token);
        return;
      }
      if (current_token.text === "::") {
        this.print_token(current_token);
        return;
      }
      if (in_array(current_token.text, ["-", "+"]) && this.start_of_object_property()) {
        this.print_token(current_token);
        return;
      }
      if (this._flags.last_token.type === TOKEN.OPERATOR && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE)) {
        this.allow_wrap_or_preserved_newline(current_token);
      }
      if (current_token.text === ":" && this._flags.in_case) {
        this.print_token(current_token);
        this._flags.in_case = false;
        this._flags.case_body = true;
        if (this._tokens.peek().type !== TOKEN.START_BLOCK) {
          this.indent();
          this.print_newline();
          this._flags.case_block = false;
        } else {
          this._flags.case_block = true;
          this._output.space_before_token = true;
        }
        return;
      }
      var space_before = true;
      var space_after = true;
      var in_ternary = false;
      if (current_token.text === ":") {
        if (this._flags.ternary_depth === 0) {
          space_before = false;
        } else {
          this._flags.ternary_depth -= 1;
          in_ternary = true;
        }
      } else if (current_token.text === "?") {
        this._flags.ternary_depth += 1;
      }
      if (!isUnary && !isGeneratorAsterisk && this._options.preserve_newlines && in_array(current_token.text, positionable_operators)) {
        var isColon = current_token.text === ":";
        var isTernaryColon = isColon && in_ternary;
        var isOtherColon = isColon && !in_ternary;
        switch (this._options.operator_position) {
          case OPERATOR_POSITION.before_newline:
            this._output.space_before_token = !isOtherColon;
            this.print_token(current_token);
            if (!isColon || isTernaryColon) {
              this.allow_wrap_or_preserved_newline(current_token);
            }
            this._output.space_before_token = true;
            return;
          case OPERATOR_POSITION.after_newline:
            this._output.space_before_token = true;
            if (!isColon || isTernaryColon) {
              if (this._tokens.peek().newlines) {
                this.print_newline(false, true);
              } else {
                this.allow_wrap_or_preserved_newline(current_token);
              }
            } else {
              this._output.space_before_token = false;
            }
            this.print_token(current_token);
            this._output.space_before_token = true;
            return;
          case OPERATOR_POSITION.preserve_newline:
            if (!isOtherColon) {
              this.allow_wrap_or_preserved_newline(current_token);
            }
            space_before = !(this._output.just_added_newline() || isOtherColon);
            this._output.space_before_token = space_before;
            this.print_token(current_token);
            this._output.space_before_token = true;
            return;
        }
      }
      if (isGeneratorAsterisk) {
        this.allow_wrap_or_preserved_newline(current_token);
        space_before = false;
        var next_token = this._tokens.peek();
        space_after = next_token && in_array(next_token.type, [TOKEN.WORD, TOKEN.RESERVED]);
      } else if (current_token.text === "...") {
        this.allow_wrap_or_preserved_newline(current_token);
        space_before = this._flags.last_token.type === TOKEN.START_BLOCK;
        space_after = false;
      } else if (in_array(current_token.text, ["--", "++", "!", "~"]) || isUnary) {
        if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
        space_before = false;
        space_after = false;
        if (current_token.newlines && (current_token.text === "--" || current_token.text === "++" || current_token.text === "~")) {
          var new_line_needed = reserved_array(this._flags.last_token, special_words) && current_token.newlines;
          if (new_line_needed && (this._previous_flags.if_block || this._previous_flags.else_block)) {
            this.restore_mode();
          }
          this.print_newline(new_line_needed, true);
        }
        if (this._flags.last_token.text === ";" && is_expression(this._flags.mode)) {
          space_before = true;
        }
        if (this._flags.last_token.type === TOKEN.RESERVED) {
          space_before = true;
        } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
          space_before = !(this._flags.last_token.text === "]" && (current_token.text === "--" || current_token.text === "++"));
        } else if (this._flags.last_token.type === TOKEN.OPERATOR) {
          space_before = in_array(current_token.text, ["--", "-", "++", "+"]) && in_array(this._flags.last_token.text, ["--", "-", "++", "+"]);
          if (in_array(current_token.text, ["+", "-"]) && in_array(this._flags.last_token.text, ["--", "++"])) {
            space_after = true;
          }
        }
        if ((this._flags.mode === MODE.BlockStatement && !this._flags.inline_frame || this._flags.mode === MODE.Statement) && (this._flags.last_token.text === "{" || this._flags.last_token.text === ";")) {
          this.print_newline();
        }
      }
      this._output.space_before_token = this._output.space_before_token || space_before;
      this.print_token(current_token);
      this._output.space_before_token = space_after;
    };
    Beautifier.prototype.handle_block_comment = function(current_token, preserve_statement_flags) {
      if (this._output.raw) {
        this._output.add_raw_token(current_token);
        if (current_token.directives && current_token.directives.preserve === "end") {
          this._output.raw = this._options.test_output_raw;
        }
        return;
      }
      if (current_token.directives) {
        this.print_newline(false, preserve_statement_flags);
        this.print_token(current_token);
        if (current_token.directives.preserve === "start") {
          this._output.raw = true;
        }
        this.print_newline(false, true);
        return;
      }
      if (!acorn.newline.test(current_token.text) && !current_token.newlines) {
        this._output.space_before_token = true;
        this.print_token(current_token);
        this._output.space_before_token = true;
        return;
      } else {
        this.print_block_commment(current_token, preserve_statement_flags);
      }
    };
    Beautifier.prototype.print_block_commment = function(current_token, preserve_statement_flags) {
      var lines = split_linebreaks(current_token.text);
      var j;
      var javadoc = false;
      var starless = false;
      var lastIndent = current_token.whitespace_before;
      var lastIndentLength = lastIndent.length;
      this.print_newline(false, preserve_statement_flags);
      this.print_token_line_indentation(current_token);
      this._output.add_token(lines[0]);
      this.print_newline(false, preserve_statement_flags);
      if (lines.length > 1) {
        lines = lines.slice(1);
        javadoc = all_lines_start_with(lines, "*");
        starless = each_line_matches_indent(lines, lastIndent);
        if (javadoc) {
          this._flags.alignment = 1;
        }
        for (j = 0; j < lines.length; j++) {
          if (javadoc) {
            this.print_token_line_indentation(current_token);
            this._output.add_token(ltrim(lines[j]));
          } else if (starless && lines[j]) {
            this.print_token_line_indentation(current_token);
            this._output.add_token(lines[j].substring(lastIndentLength));
          } else {
            this._output.current_line.set_indent(-1);
            this._output.add_token(lines[j]);
          }
          this.print_newline(false, preserve_statement_flags);
        }
        this._flags.alignment = 0;
      }
    };
    Beautifier.prototype.handle_comment = function(current_token, preserve_statement_flags) {
      if (current_token.newlines) {
        this.print_newline(false, preserve_statement_flags);
      } else {
        this._output.trim(true);
      }
      this._output.space_before_token = true;
      this.print_token(current_token);
      this.print_newline(false, preserve_statement_flags);
    };
    Beautifier.prototype.handle_dot = function(current_token) {
      if (this.start_of_statement(current_token)) {
      } else {
        this.handle_whitespace_and_comments(current_token, true);
      }
      if (this._flags.last_token.text.match("^[0-9]+$")) {
        this._output.space_before_token = true;
      }
      if (reserved_array(this._flags.last_token, special_words)) {
        this._output.space_before_token = false;
      } else {
        this.allow_wrap_or_preserved_newline(
          current_token,
          this._flags.last_token.text === ")" && this._options.break_chained_methods
        );
      }
      if (this._options.unindent_chained_methods && this._output.just_added_newline()) {
        this.deindent();
      }
      this.print_token(current_token);
    };
    Beautifier.prototype.handle_unknown = function(current_token, preserve_statement_flags) {
      this.print_token(current_token);
      if (current_token.text[current_token.text.length - 1] === "\n") {
        this.print_newline(false, preserve_statement_flags);
      }
    };
    Beautifier.prototype.handle_eof = function(current_token) {
      while (this._flags.mode === MODE.Statement) {
        this.restore_mode();
      }
      this.handle_whitespace_and_comments(current_token);
    };
    module2.exports.Beautifier = Beautifier;
  }
});

// node_modules/js-beautify/js/src/javascript/index.js
var require_javascript = __commonJS({
  "node_modules/js-beautify/js/src/javascript/index.js"(exports2, module2) {
    "use strict";
    var Beautifier = require_beautifier().Beautifier;
    var Options = require_options2().Options;
    function js_beautify2(js_source_text, options) {
      var beautifier = new Beautifier(js_source_text, options);
      return beautifier.beautify();
    }
    module2.exports = js_beautify2;
    module2.exports.defaultOptions = function() {
      return new Options();
    };
  }
});

// node_modules/js-beautify/js/src/css/options.js
var require_options3 = __commonJS({
  "node_modules/js-beautify/js/src/css/options.js"(exports2, module2) {
    "use strict";
    var BaseOptions = require_options().Options;
    function Options(options) {
      BaseOptions.call(this, options, "css");
      this.selector_separator_newline = this._get_boolean("selector_separator_newline", true);
      this.newline_between_rules = this._get_boolean("newline_between_rules", true);
      var space_around_selector_separator = this._get_boolean("space_around_selector_separator");
      this.space_around_combinator = this._get_boolean("space_around_combinator") || space_around_selector_separator;
      var brace_style_split = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
      this.brace_style = "collapse";
      for (var bs = 0; bs < brace_style_split.length; bs++) {
        if (brace_style_split[bs] !== "expand") {
          this.brace_style = "collapse";
        } else {
          this.brace_style = brace_style_split[bs];
        }
      }
    }
    Options.prototype = new BaseOptions();
    module2.exports.Options = Options;
  }
});

// node_modules/js-beautify/js/src/css/beautifier.js
var require_beautifier2 = __commonJS({
  "node_modules/js-beautify/js/src/css/beautifier.js"(exports2, module2) {
    "use strict";
    var Options = require_options3().Options;
    var Output = require_output().Output;
    var InputScanner = require_inputscanner().InputScanner;
    var Directives = require_directives().Directives;
    var directives_core = new Directives(/\/\*/, /\*\//);
    var lineBreak = /\r\n|[\r\n]/;
    var allLineBreaks = /\r\n|[\r\n]/g;
    var whitespaceChar = /\s/;
    var whitespacePattern = /(?:\s|\n)+/g;
    var block_comment_pattern = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g;
    var comment_pattern = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
    function Beautifier(source_text, options) {
      this._source_text = source_text || "";
      this._options = new Options(options);
      this._ch = null;
      this._input = null;
      this.NESTED_AT_RULE = {
        "page": true,
        "font-face": true,
        "keyframes": true,
        // also in CONDITIONAL_GROUP_RULE below
        "media": true,
        "supports": true,
        "document": true
      };
      this.CONDITIONAL_GROUP_RULE = {
        "media": true,
        "supports": true,
        "document": true
      };
      this.NON_SEMICOLON_NEWLINE_PROPERTY = [
        "grid-template-areas",
        "grid-template"
      ];
    }
    Beautifier.prototype.eatString = function(endChars) {
      var result = "";
      this._ch = this._input.next();
      while (this._ch) {
        result += this._ch;
        if (this._ch === "\\") {
          result += this._input.next();
        } else if (endChars.indexOf(this._ch) !== -1 || this._ch === "\n") {
          break;
        }
        this._ch = this._input.next();
      }
      return result;
    };
    Beautifier.prototype.eatWhitespace = function(allowAtLeastOneNewLine) {
      var result = whitespaceChar.test(this._input.peek());
      var newline_count = 0;
      while (whitespaceChar.test(this._input.peek())) {
        this._ch = this._input.next();
        if (allowAtLeastOneNewLine && this._ch === "\n") {
          if (newline_count === 0 || newline_count < this._options.max_preserve_newlines) {
            newline_count++;
            this._output.add_new_line(true);
          }
        }
      }
      return result;
    };
    Beautifier.prototype.foundNestedPseudoClass = function() {
      var openParen = 0;
      var i = 1;
      var ch = this._input.peek(i);
      while (ch) {
        if (ch === "{") {
          return true;
        } else if (ch === "(") {
          openParen += 1;
        } else if (ch === ")") {
          if (openParen === 0) {
            return false;
          }
          openParen -= 1;
        } else if (ch === ";" || ch === "}") {
          return false;
        }
        i++;
        ch = this._input.peek(i);
      }
      return false;
    };
    Beautifier.prototype.print_string = function(output_string) {
      this._output.set_indent(this._indentLevel);
      this._output.non_breaking_space = true;
      this._output.add_token(output_string);
    };
    Beautifier.prototype.preserveSingleSpace = function(isAfterSpace) {
      if (isAfterSpace) {
        this._output.space_before_token = true;
      }
    };
    Beautifier.prototype.indent = function() {
      this._indentLevel++;
    };
    Beautifier.prototype.outdent = function() {
      if (this._indentLevel > 0) {
        this._indentLevel--;
      }
    };
    Beautifier.prototype.beautify = function() {
      if (this._options.disabled) {
        return this._source_text;
      }
      var source_text = this._source_text;
      var eol = this._options.eol;
      if (eol === "auto") {
        eol = "\n";
        if (source_text && lineBreak.test(source_text || "")) {
          eol = source_text.match(lineBreak)[0];
        }
      }
      source_text = source_text.replace(allLineBreaks, "\n");
      var baseIndentString = source_text.match(/^[\t ]*/)[0];
      this._output = new Output(this._options, baseIndentString);
      this._input = new InputScanner(source_text);
      this._indentLevel = 0;
      this._nestedLevel = 0;
      this._ch = null;
      var parenLevel = 0;
      var insideRule = false;
      var insidePropertyValue = false;
      var enteringConditionalGroup = false;
      var insideNonNestedAtRule = false;
      var insideScssMap = false;
      var topCharacter = this._ch;
      var insideNonSemiColonValues = false;
      var whitespace;
      var isAfterSpace;
      var previous_ch;
      while (true) {
        whitespace = this._input.read(whitespacePattern);
        isAfterSpace = whitespace !== "";
        previous_ch = topCharacter;
        this._ch = this._input.next();
        if (this._ch === "\\" && this._input.hasNext()) {
          this._ch += this._input.next();
        }
        topCharacter = this._ch;
        if (!this._ch) {
          break;
        } else if (this._ch === "/" && this._input.peek() === "*") {
          this._output.add_new_line();
          this._input.back();
          var comment = this._input.read(block_comment_pattern);
          var directives = directives_core.get_directives(comment);
          if (directives && directives.ignore === "start") {
            comment += directives_core.readIgnored(this._input);
          }
          this.print_string(comment);
          this.eatWhitespace(true);
          this._output.add_new_line();
        } else if (this._ch === "/" && this._input.peek() === "/") {
          this._output.space_before_token = true;
          this._input.back();
          this.print_string(this._input.read(comment_pattern));
          this.eatWhitespace(true);
        } else if (this._ch === "$") {
          this.preserveSingleSpace(isAfterSpace);
          this.print_string(this._ch);
          var variable = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
          if (variable.match(/[ :]$/)) {
            variable = this.eatString(": ").replace(/\s+$/, "");
            this.print_string(variable);
            this._output.space_before_token = true;
          }
          if (parenLevel === 0 && variable.indexOf(":") !== -1) {
            insidePropertyValue = true;
            this.indent();
          }
        } else if (this._ch === "@") {
          this.preserveSingleSpace(isAfterSpace);
          if (this._input.peek() === "{") {
            this.print_string(this._ch + this.eatString("}"));
          } else {
            this.print_string(this._ch);
            var variableOrRule = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
            if (variableOrRule.match(/[ :]$/)) {
              variableOrRule = this.eatString(": ").replace(/\s+$/, "");
              this.print_string(variableOrRule);
              this._output.space_before_token = true;
            }
            if (parenLevel === 0 && variableOrRule.indexOf(":") !== -1) {
              insidePropertyValue = true;
              this.indent();
            } else if (variableOrRule in this.NESTED_AT_RULE) {
              this._nestedLevel += 1;
              if (variableOrRule in this.CONDITIONAL_GROUP_RULE) {
                enteringConditionalGroup = true;
              }
            } else if (parenLevel === 0 && !insidePropertyValue) {
              insideNonNestedAtRule = true;
            }
          }
        } else if (this._ch === "#" && this._input.peek() === "{") {
          this.preserveSingleSpace(isAfterSpace);
          this.print_string(this._ch + this.eatString("}"));
        } else if (this._ch === "{") {
          if (insidePropertyValue) {
            insidePropertyValue = false;
            this.outdent();
          }
          insideNonNestedAtRule = false;
          if (enteringConditionalGroup) {
            enteringConditionalGroup = false;
            insideRule = this._indentLevel >= this._nestedLevel;
          } else {
            insideRule = this._indentLevel >= this._nestedLevel - 1;
          }
          if (this._options.newline_between_rules && insideRule) {
            if (this._output.previous_line && this._output.previous_line.item(-1) !== "{") {
              this._output.ensure_empty_line_above("/", ",");
            }
          }
          this._output.space_before_token = true;
          if (this._options.brace_style === "expand") {
            this._output.add_new_line();
            this.print_string(this._ch);
            this.indent();
            this._output.set_indent(this._indentLevel);
          } else {
            if (previous_ch === "(") {
              this._output.space_before_token = false;
            } else if (previous_ch !== ",") {
              this.indent();
            }
            this.print_string(this._ch);
          }
          this.eatWhitespace(true);
          this._output.add_new_line();
        } else if (this._ch === "}") {
          this.outdent();
          this._output.add_new_line();
          if (previous_ch === "{") {
            this._output.trim(true);
          }
          if (insidePropertyValue) {
            this.outdent();
            insidePropertyValue = false;
          }
          this.print_string(this._ch);
          insideRule = false;
          if (this._nestedLevel) {
            this._nestedLevel--;
          }
          this.eatWhitespace(true);
          this._output.add_new_line();
          if (this._options.newline_between_rules && !this._output.just_added_blankline()) {
            if (this._input.peek() !== "}") {
              this._output.add_new_line(true);
            }
          }
          if (this._input.peek() === ")") {
            this._output.trim(true);
            if (this._options.brace_style === "expand") {
              this._output.add_new_line(true);
            }
          }
        } else if (this._ch === ":") {
          for (var i = 0; i < this.NON_SEMICOLON_NEWLINE_PROPERTY.length; i++) {
            if (this._input.lookBack(this.NON_SEMICOLON_NEWLINE_PROPERTY[i])) {
              insideNonSemiColonValues = true;
              break;
            }
          }
          if ((insideRule || enteringConditionalGroup) && !(this._input.lookBack("&") || this.foundNestedPseudoClass()) && !this._input.lookBack("(") && !insideNonNestedAtRule && parenLevel === 0) {
            this.print_string(":");
            if (!insidePropertyValue) {
              insidePropertyValue = true;
              this._output.space_before_token = true;
              this.eatWhitespace(true);
              this.indent();
            }
          } else {
            if (this._input.lookBack(" ")) {
              this._output.space_before_token = true;
            }
            if (this._input.peek() === ":") {
              this._ch = this._input.next();
              this.print_string("::");
            } else {
              this.print_string(":");
            }
          }
        } else if (this._ch === '"' || this._ch === "'") {
          var preserveQuoteSpace = previous_ch === '"' || previous_ch === "'";
          this.preserveSingleSpace(preserveQuoteSpace || isAfterSpace);
          this.print_string(this._ch + this.eatString(this._ch));
          this.eatWhitespace(true);
        } else if (this._ch === ";") {
          insideNonSemiColonValues = false;
          if (parenLevel === 0) {
            if (insidePropertyValue) {
              this.outdent();
              insidePropertyValue = false;
            }
            insideNonNestedAtRule = false;
            this.print_string(this._ch);
            this.eatWhitespace(true);
            if (this._input.peek() !== "/") {
              this._output.add_new_line();
            }
          } else {
            this.print_string(this._ch);
            this.eatWhitespace(true);
            this._output.space_before_token = true;
          }
        } else if (this._ch === "(") {
          if (this._input.lookBack("url")) {
            this.print_string(this._ch);
            this.eatWhitespace();
            parenLevel++;
            this.indent();
            this._ch = this._input.next();
            if (this._ch === ")" || this._ch === '"' || this._ch === "'") {
              this._input.back();
            } else if (this._ch) {
              this.print_string(this._ch + this.eatString(")"));
              if (parenLevel) {
                parenLevel--;
                this.outdent();
              }
            }
          } else {
            var space_needed = false;
            if (this._input.lookBack("with")) {
              space_needed = true;
            }
            this.preserveSingleSpace(isAfterSpace || space_needed);
            this.print_string(this._ch);
            if (insidePropertyValue && previous_ch === "$" && this._options.selector_separator_newline) {
              this._output.add_new_line();
              insideScssMap = true;
            } else {
              this.eatWhitespace();
              parenLevel++;
              this.indent();
            }
          }
        } else if (this._ch === ")") {
          if (parenLevel) {
            parenLevel--;
            this.outdent();
          }
          if (insideScssMap && this._input.peek() === ";" && this._options.selector_separator_newline) {
            insideScssMap = false;
            this.outdent();
            this._output.add_new_line();
          }
          this.print_string(this._ch);
        } else if (this._ch === ",") {
          this.print_string(this._ch);
          this.eatWhitespace(true);
          if (this._options.selector_separator_newline && (!insidePropertyValue || insideScssMap) && parenLevel === 0 && !insideNonNestedAtRule) {
            this._output.add_new_line();
          } else {
            this._output.space_before_token = true;
          }
        } else if ((this._ch === ">" || this._ch === "+" || this._ch === "~") && !insidePropertyValue && parenLevel === 0) {
          if (this._options.space_around_combinator) {
            this._output.space_before_token = true;
            this.print_string(this._ch);
            this._output.space_before_token = true;
          } else {
            this.print_string(this._ch);
            this.eatWhitespace();
            if (this._ch && whitespaceChar.test(this._ch)) {
              this._ch = "";
            }
          }
        } else if (this._ch === "]") {
          this.print_string(this._ch);
        } else if (this._ch === "[") {
          this.preserveSingleSpace(isAfterSpace);
          this.print_string(this._ch);
        } else if (this._ch === "=") {
          this.eatWhitespace();
          this.print_string("=");
          if (whitespaceChar.test(this._ch)) {
            this._ch = "";
          }
        } else if (this._ch === "!" && !this._input.lookBack("\\")) {
          this._output.space_before_token = true;
          this.print_string(this._ch);
        } else {
          var preserveAfterSpace = previous_ch === '"' || previous_ch === "'";
          this.preserveSingleSpace(preserveAfterSpace || isAfterSpace);
          this.print_string(this._ch);
          if (!this._output.just_added_newline() && this._input.peek() === "\n" && insideNonSemiColonValues) {
            this._output.add_new_line();
          }
        }
      }
      var sweetCode = this._output.get_code(eol);
      return sweetCode;
    };
    module2.exports.Beautifier = Beautifier;
  }
});

// node_modules/js-beautify/js/src/css/index.js
var require_css = __commonJS({
  "node_modules/js-beautify/js/src/css/index.js"(exports2, module2) {
    "use strict";
    var Beautifier = require_beautifier2().Beautifier;
    var Options = require_options3().Options;
    function css_beautify(source_text, options) {
      var beautifier = new Beautifier(source_text, options);
      return beautifier.beautify();
    }
    module2.exports = css_beautify;
    module2.exports.defaultOptions = function() {
      return new Options();
    };
  }
});

// node_modules/js-beautify/js/src/html/options.js
var require_options4 = __commonJS({
  "node_modules/js-beautify/js/src/html/options.js"(exports2, module2) {
    "use strict";
    var BaseOptions = require_options().Options;
    function Options(options) {
      BaseOptions.call(this, options, "html");
      if (this.templating.length === 1 && this.templating[0] === "auto") {
        this.templating = ["django", "erb", "handlebars", "php"];
      }
      this.indent_inner_html = this._get_boolean("indent_inner_html");
      this.indent_body_inner_html = this._get_boolean("indent_body_inner_html", true);
      this.indent_head_inner_html = this._get_boolean("indent_head_inner_html", true);
      this.indent_handlebars = this._get_boolean("indent_handlebars", true);
      this.wrap_attributes = this._get_selection(
        "wrap_attributes",
        ["auto", "force", "force-aligned", "force-expand-multiline", "aligned-multiple", "preserve", "preserve-aligned"]
      );
      this.wrap_attributes_min_attrs = this._get_number("wrap_attributes_min_attrs", 2);
      this.wrap_attributes_indent_size = this._get_number("wrap_attributes_indent_size", this.indent_size);
      this.extra_liners = this._get_array("extra_liners", ["head", "body", "/html"]);
      this.inline = this._get_array("inline", [
        "a",
        "abbr",
        "area",
        "audio",
        "b",
        "bdi",
        "bdo",
        "br",
        "button",
        "canvas",
        "cite",
        "code",
        "data",
        "datalist",
        "del",
        "dfn",
        "em",
        "embed",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "keygen",
        "label",
        "map",
        "mark",
        "math",
        "meter",
        "noscript",
        "object",
        "output",
        "progress",
        "q",
        "ruby",
        "s",
        "samp",
        /* 'script', */
        "select",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "svg",
        "template",
        "textarea",
        "time",
        "u",
        "var",
        "video",
        "wbr",
        "text",
        // obsolete inline tags
        "acronym",
        "big",
        "strike",
        "tt"
      ]);
      this.inline_custom_elements = this._get_boolean("inline_custom_elements", true);
      this.void_elements = this._get_array("void_elements", [
        // HTLM void elements - aka self-closing tags - aka singletons
        // https://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "keygen",
        "link",
        "menuitem",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
        // NOTE: Optional tags are too complex for a simple list
        // they are hard coded in _do_optional_end_element
        // Doctype and xml elements
        "!doctype",
        "?xml",
        // obsolete tags
        // basefont: https://www.computerhope.com/jargon/h/html-basefont-tag.htm
        // isndex: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/isindex
        "basefont",
        "isindex"
      ]);
      this.unformatted = this._get_array("unformatted", []);
      this.content_unformatted = this._get_array("content_unformatted", [
        "pre",
        "textarea"
      ]);
      this.unformatted_content_delimiter = this._get_characters("unformatted_content_delimiter");
      this.indent_scripts = this._get_selection("indent_scripts", ["normal", "keep", "separate"]);
    }
    Options.prototype = new BaseOptions();
    module2.exports.Options = Options;
  }
});

// node_modules/js-beautify/js/src/html/tokenizer.js
var require_tokenizer3 = __commonJS({
  "node_modules/js-beautify/js/src/html/tokenizer.js"(exports2, module2) {
    "use strict";
    var BaseTokenizer = require_tokenizer().Tokenizer;
    var BASETOKEN = require_tokenizer().TOKEN;
    var Directives = require_directives().Directives;
    var TemplatablePattern = require_templatablepattern().TemplatablePattern;
    var Pattern = require_pattern().Pattern;
    var TOKEN = {
      TAG_OPEN: "TK_TAG_OPEN",
      TAG_CLOSE: "TK_TAG_CLOSE",
      CONTROL_FLOW_OPEN: "TK_CONTROL_FLOW_OPEN",
      CONTROL_FLOW_CLOSE: "TK_CONTROL_FLOW_CLOSE",
      ATTRIBUTE: "TK_ATTRIBUTE",
      EQUALS: "TK_EQUALS",
      VALUE: "TK_VALUE",
      COMMENT: "TK_COMMENT",
      TEXT: "TK_TEXT",
      UNKNOWN: "TK_UNKNOWN",
      START: BASETOKEN.START,
      RAW: BASETOKEN.RAW,
      EOF: BASETOKEN.EOF
    };
    var directives_core = new Directives(/<\!--/, /-->/);
    var Tokenizer = function(input_string, options) {
      BaseTokenizer.call(this, input_string, options);
      this._current_tag_name = "";
      var templatable_reader = new TemplatablePattern(this._input).read_options(this._options);
      var pattern_reader = new Pattern(this._input);
      this.__patterns = {
        word: templatable_reader.until(/[\n\r\t <]/),
        word_control_flow_close_excluded: templatable_reader.until(/[\n\r\t <}]/),
        single_quote: templatable_reader.until_after(/'/),
        double_quote: templatable_reader.until_after(/"/),
        attribute: templatable_reader.until(/[\n\r\t =>]|\/>/),
        element_name: templatable_reader.until(/[\n\r\t >\/]/),
        angular_control_flow_start: pattern_reader.matching(/\@[a-zA-Z]+[^({]*[({]/),
        handlebars_comment: pattern_reader.starting_with(/{{!--/).until_after(/--}}/),
        handlebars: pattern_reader.starting_with(/{{/).until_after(/}}/),
        handlebars_open: pattern_reader.until(/[\n\r\t }]/),
        handlebars_raw_close: pattern_reader.until(/}}/),
        comment: pattern_reader.starting_with(/<!--/).until_after(/-->/),
        cdata: pattern_reader.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
        // https://en.wikipedia.org/wiki/Conditional_comment
        conditional_comment: pattern_reader.starting_with(/<!\[/).until_after(/]>/),
        processing: pattern_reader.starting_with(/<\?/).until_after(/\?>/)
      };
      if (this._options.indent_handlebars) {
        this.__patterns.word = this.__patterns.word.exclude("handlebars");
        this.__patterns.word_control_flow_close_excluded = this.__patterns.word_control_flow_close_excluded.exclude("handlebars");
      }
      this._unformatted_content_delimiter = null;
      if (this._options.unformatted_content_delimiter) {
        var literal_regexp = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
        this.__patterns.unformatted_content_delimiter = pattern_reader.matching(literal_regexp).until_after(literal_regexp);
      }
    };
    Tokenizer.prototype = new BaseTokenizer();
    Tokenizer.prototype._is_comment = function(current_token) {
      return false;
    };
    Tokenizer.prototype._is_opening = function(current_token) {
      return current_token.type === TOKEN.TAG_OPEN || current_token.type === TOKEN.CONTROL_FLOW_OPEN;
    };
    Tokenizer.prototype._is_closing = function(current_token, open_token) {
      return current_token.type === TOKEN.TAG_CLOSE && (open_token && ((current_token.text === ">" || current_token.text === "/>") && open_token.text[0] === "<" || current_token.text === "}}" && open_token.text[0] === "{" && open_token.text[1] === "{")) || current_token.type === TOKEN.CONTROL_FLOW_CLOSE && (current_token.text === "}" && open_token.text.endsWith("{"));
    };
    Tokenizer.prototype._reset = function() {
      this._current_tag_name = "";
    };
    Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
      var token = null;
      this._readWhitespace();
      var c = this._input.peek();
      if (c === null) {
        return this._create_token(TOKEN.EOF, "");
      }
      token = token || this._read_open_handlebars(c, open_token);
      token = token || this._read_attribute(c, previous_token, open_token);
      token = token || this._read_close(c, open_token);
      token = token || this._read_script_and_style(c, previous_token);
      token = token || this._read_control_flows(c, open_token);
      token = token || this._read_raw_content(c, previous_token, open_token);
      token = token || this._read_content_word(c, open_token);
      token = token || this._read_comment_or_cdata(c);
      token = token || this._read_processing(c);
      token = token || this._read_open(c, open_token);
      token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
      return token;
    };
    Tokenizer.prototype._read_comment_or_cdata = function(c) {
      var token = null;
      var resulting_string = null;
      var directives = null;
      if (c === "<") {
        var peek1 = this._input.peek(1);
        if (peek1 === "!") {
          resulting_string = this.__patterns.comment.read();
          if (resulting_string) {
            directives = directives_core.get_directives(resulting_string);
            if (directives && directives.ignore === "start") {
              resulting_string += directives_core.readIgnored(this._input);
            }
          } else {
            resulting_string = this.__patterns.cdata.read();
          }
        }
        if (resulting_string) {
          token = this._create_token(TOKEN.COMMENT, resulting_string);
          token.directives = directives;
        }
      }
      return token;
    };
    Tokenizer.prototype._read_processing = function(c) {
      var token = null;
      var resulting_string = null;
      var directives = null;
      if (c === "<") {
        var peek1 = this._input.peek(1);
        if (peek1 === "!" || peek1 === "?") {
          resulting_string = this.__patterns.conditional_comment.read();
          resulting_string = resulting_string || this.__patterns.processing.read();
        }
        if (resulting_string) {
          token = this._create_token(TOKEN.COMMENT, resulting_string);
          token.directives = directives;
        }
      }
      return token;
    };
    Tokenizer.prototype._read_open = function(c, open_token) {
      var resulting_string = null;
      var token = null;
      if (!open_token || open_token.type === TOKEN.CONTROL_FLOW_OPEN) {
        if (c === "<") {
          resulting_string = this._input.next();
          if (this._input.peek() === "/") {
            resulting_string += this._input.next();
          }
          resulting_string += this.__patterns.element_name.read();
          token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
        }
      }
      return token;
    };
    Tokenizer.prototype._read_open_handlebars = function(c, open_token) {
      var resulting_string = null;
      var token = null;
      if (!open_token || open_token.type === TOKEN.CONTROL_FLOW_OPEN) {
        if ((this._options.templating.includes("angular") || this._options.indent_handlebars) && c === "{" && this._input.peek(1) === "{") {
          if (this._options.indent_handlebars && this._input.peek(2) === "!") {
            resulting_string = this.__patterns.handlebars_comment.read();
            resulting_string = resulting_string || this.__patterns.handlebars.read();
            token = this._create_token(TOKEN.COMMENT, resulting_string);
          } else {
            resulting_string = this.__patterns.handlebars_open.read();
            token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
          }
        }
      }
      return token;
    };
    Tokenizer.prototype._read_control_flows = function(c, open_token) {
      var resulting_string = "";
      var token = null;
      if (!this._options.templating.includes("angular")) {
        return token;
      }
      if (c === "@") {
        resulting_string = this.__patterns.angular_control_flow_start.read();
        if (resulting_string === "") {
          return token;
        }
        var opening_parentheses_count = resulting_string.endsWith("(") ? 1 : 0;
        var closing_parentheses_count = 0;
        while (!(resulting_string.endsWith("{") && opening_parentheses_count === closing_parentheses_count)) {
          var next_char = this._input.next();
          if (next_char === null) {
            break;
          } else if (next_char === "(") {
            opening_parentheses_count++;
          } else if (next_char === ")") {
            closing_parentheses_count++;
          }
          resulting_string += next_char;
        }
        token = this._create_token(TOKEN.CONTROL_FLOW_OPEN, resulting_string);
      } else if (c === "}" && open_token && open_token.type === TOKEN.CONTROL_FLOW_OPEN) {
        resulting_string = this._input.next();
        token = this._create_token(TOKEN.CONTROL_FLOW_CLOSE, resulting_string);
      }
      return token;
    };
    Tokenizer.prototype._read_close = function(c, open_token) {
      var resulting_string = null;
      var token = null;
      if (open_token && open_token.type === TOKEN.TAG_OPEN) {
        if (open_token.text[0] === "<" && (c === ">" || c === "/" && this._input.peek(1) === ">")) {
          resulting_string = this._input.next();
          if (c === "/") {
            resulting_string += this._input.next();
          }
          token = this._create_token(TOKEN.TAG_CLOSE, resulting_string);
        } else if (open_token.text[0] === "{" && c === "}" && this._input.peek(1) === "}") {
          this._input.next();
          this._input.next();
          token = this._create_token(TOKEN.TAG_CLOSE, "}}");
        }
      }
      return token;
    };
    Tokenizer.prototype._read_attribute = function(c, previous_token, open_token) {
      var token = null;
      var resulting_string = "";
      if (open_token && open_token.text[0] === "<") {
        if (c === "=") {
          token = this._create_token(TOKEN.EQUALS, this._input.next());
        } else if (c === '"' || c === "'") {
          var content = this._input.next();
          if (c === '"') {
            content += this.__patterns.double_quote.read();
          } else {
            content += this.__patterns.single_quote.read();
          }
          token = this._create_token(TOKEN.VALUE, content);
        } else {
          resulting_string = this.__patterns.attribute.read();
          if (resulting_string) {
            if (previous_token.type === TOKEN.EQUALS) {
              token = this._create_token(TOKEN.VALUE, resulting_string);
            } else {
              token = this._create_token(TOKEN.ATTRIBUTE, resulting_string);
            }
          }
        }
      }
      return token;
    };
    Tokenizer.prototype._is_content_unformatted = function(tag_name) {
      return this._options.void_elements.indexOf(tag_name) === -1 && (this._options.content_unformatted.indexOf(tag_name) !== -1 || this._options.unformatted.indexOf(tag_name) !== -1);
    };
    Tokenizer.prototype._read_raw_content = function(c, previous_token, open_token) {
      var resulting_string = "";
      if (open_token && open_token.text[0] === "{") {
        resulting_string = this.__patterns.handlebars_raw_close.read();
      } else if (previous_token.type === TOKEN.TAG_CLOSE && previous_token.opened.text[0] === "<" && previous_token.text[0] !== "/") {
        var tag_name = previous_token.opened.text.substr(1).toLowerCase();
        if (this._is_content_unformatted(tag_name)) {
          resulting_string = this._input.readUntil(new RegExp("</" + tag_name + "[\\n\\r\\t ]*?>", "ig"));
        }
      }
      if (resulting_string) {
        return this._create_token(TOKEN.TEXT, resulting_string);
      }
      return null;
    };
    Tokenizer.prototype._read_script_and_style = function(c, previous_token) {
      if (previous_token.type === TOKEN.TAG_CLOSE && previous_token.opened.text[0] === "<" && previous_token.text[0] !== "/") {
        var tag_name = previous_token.opened.text.substr(1).toLowerCase();
        if (tag_name === "script" || tag_name === "style") {
          var token = this._read_comment_or_cdata(c);
          if (token) {
            token.type = TOKEN.TEXT;
            return token;
          }
          var resulting_string = this._input.readUntil(new RegExp("</" + tag_name + "[\\n\\r\\t ]*?>", "ig"));
          if (resulting_string) {
            return this._create_token(TOKEN.TEXT, resulting_string);
          }
        }
      }
      return null;
    };
    Tokenizer.prototype._read_content_word = function(c, open_token) {
      var resulting_string = "";
      if (this._options.unformatted_content_delimiter) {
        if (c === this._options.unformatted_content_delimiter[0]) {
          resulting_string = this.__patterns.unformatted_content_delimiter.read();
        }
      }
      if (!resulting_string) {
        resulting_string = open_token && open_token.type === TOKEN.CONTROL_FLOW_OPEN ? this.__patterns.word_control_flow_close_excluded.read() : this.__patterns.word.read();
      }
      if (resulting_string) {
        return this._create_token(TOKEN.TEXT, resulting_string);
      }
      return null;
    };
    module2.exports.Tokenizer = Tokenizer;
    module2.exports.TOKEN = TOKEN;
  }
});

// node_modules/js-beautify/js/src/html/beautifier.js
var require_beautifier3 = __commonJS({
  "node_modules/js-beautify/js/src/html/beautifier.js"(exports2, module2) {
    "use strict";
    var Options = require_options4().Options;
    var Output = require_output().Output;
    var Tokenizer = require_tokenizer3().Tokenizer;
    var TOKEN = require_tokenizer3().TOKEN;
    var lineBreak = /\r\n|[\r\n]/;
    var allLineBreaks = /\r\n|[\r\n]/g;
    var Printer = function(options, base_indent_string) {
      this.indent_level = 0;
      this.alignment_size = 0;
      this.max_preserve_newlines = options.max_preserve_newlines;
      this.preserve_newlines = options.preserve_newlines;
      this._output = new Output(options, base_indent_string);
    };
    Printer.prototype.current_line_has_match = function(pattern) {
      return this._output.current_line.has_match(pattern);
    };
    Printer.prototype.set_space_before_token = function(value, non_breaking) {
      this._output.space_before_token = value;
      this._output.non_breaking_space = non_breaking;
    };
    Printer.prototype.set_wrap_point = function() {
      this._output.set_indent(this.indent_level, this.alignment_size);
      this._output.set_wrap_point();
    };
    Printer.prototype.add_raw_token = function(token) {
      this._output.add_raw_token(token);
    };
    Printer.prototype.print_preserved_newlines = function(raw_token) {
      var newlines = 0;
      if (raw_token.type !== TOKEN.TEXT && raw_token.previous.type !== TOKEN.TEXT) {
        newlines = raw_token.newlines ? 1 : 0;
      }
      if (this.preserve_newlines) {
        newlines = raw_token.newlines < this.max_preserve_newlines + 1 ? raw_token.newlines : this.max_preserve_newlines + 1;
      }
      for (var n = 0; n < newlines; n++) {
        this.print_newline(n > 0);
      }
      return newlines !== 0;
    };
    Printer.prototype.traverse_whitespace = function(raw_token) {
      if (raw_token.whitespace_before || raw_token.newlines) {
        if (!this.print_preserved_newlines(raw_token)) {
          this._output.space_before_token = true;
        }
        return true;
      }
      return false;
    };
    Printer.prototype.previous_token_wrapped = function() {
      return this._output.previous_token_wrapped;
    };
    Printer.prototype.print_newline = function(force) {
      this._output.add_new_line(force);
    };
    Printer.prototype.print_token = function(token) {
      if (token.text) {
        this._output.set_indent(this.indent_level, this.alignment_size);
        this._output.add_token(token.text);
      }
    };
    Printer.prototype.indent = function() {
      this.indent_level++;
    };
    Printer.prototype.deindent = function() {
      if (this.indent_level > 0) {
        this.indent_level--;
        this._output.set_indent(this.indent_level, this.alignment_size);
      }
    };
    Printer.prototype.get_full_indent = function(level) {
      level = this.indent_level + (level || 0);
      if (level < 1) {
        return "";
      }
      return this._output.get_indent_string(level);
    };
    var get_type_attribute = function(start_token) {
      var result = null;
      var raw_token = start_token.next;
      while (raw_token.type !== TOKEN.EOF && start_token.closed !== raw_token) {
        if (raw_token.type === TOKEN.ATTRIBUTE && raw_token.text === "type") {
          if (raw_token.next && raw_token.next.type === TOKEN.EQUALS && raw_token.next.next && raw_token.next.next.type === TOKEN.VALUE) {
            result = raw_token.next.next.text;
          }
          break;
        }
        raw_token = raw_token.next;
      }
      return result;
    };
    var get_custom_beautifier_name = function(tag_check, raw_token) {
      var typeAttribute = null;
      var result = null;
      if (!raw_token.closed) {
        return null;
      }
      if (tag_check === "script") {
        typeAttribute = "text/javascript";
      } else if (tag_check === "style") {
        typeAttribute = "text/css";
      }
      typeAttribute = get_type_attribute(raw_token) || typeAttribute;
      if (typeAttribute.search("text/css") > -1) {
        result = "css";
      } else if (typeAttribute.search(/module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/) > -1) {
        result = "javascript";
      } else if (typeAttribute.search(/(text|application|dojo)\/(x-)?(html)/) > -1) {
        result = "html";
      } else if (typeAttribute.search(/test\/null/) > -1) {
        result = "null";
      }
      return result;
    };
    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }
    function TagFrame(parent, parser_token, indent_level) {
      this.parent = parent || null;
      this.tag = parser_token ? parser_token.tag_name : "";
      this.indent_level = indent_level || 0;
      this.parser_token = parser_token || null;
    }
    function TagStack(printer) {
      this._printer = printer;
      this._current_frame = null;
    }
    TagStack.prototype.get_parser_token = function() {
      return this._current_frame ? this._current_frame.parser_token : null;
    };
    TagStack.prototype.record_tag = function(parser_token) {
      var new_frame = new TagFrame(this._current_frame, parser_token, this._printer.indent_level);
      this._current_frame = new_frame;
    };
    TagStack.prototype._try_pop_frame = function(frame) {
      var parser_token = null;
      if (frame) {
        parser_token = frame.parser_token;
        this._printer.indent_level = frame.indent_level;
        this._current_frame = frame.parent;
      }
      return parser_token;
    };
    TagStack.prototype._get_frame = function(tag_list, stop_list) {
      var frame = this._current_frame;
      while (frame) {
        if (tag_list.indexOf(frame.tag) !== -1) {
          break;
        } else if (stop_list && stop_list.indexOf(frame.tag) !== -1) {
          frame = null;
          break;
        }
        frame = frame.parent;
      }
      return frame;
    };
    TagStack.prototype.try_pop = function(tag, stop_list) {
      var frame = this._get_frame([tag], stop_list);
      return this._try_pop_frame(frame);
    };
    TagStack.prototype.indent_to_tag = function(tag_list) {
      var frame = this._get_frame(tag_list);
      if (frame) {
        this._printer.indent_level = frame.indent_level;
      }
    };
    function Beautifier(source_text, options, js_beautify2, css_beautify) {
      this._source_text = source_text || "";
      options = options || {};
      this._js_beautify = js_beautify2;
      this._css_beautify = css_beautify;
      this._tag_stack = null;
      var optionHtml = new Options(options, "html");
      this._options = optionHtml;
      this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, "force".length) === "force";
      this._is_wrap_attributes_force_expand_multiline = this._options.wrap_attributes === "force-expand-multiline";
      this._is_wrap_attributes_force_aligned = this._options.wrap_attributes === "force-aligned";
      this._is_wrap_attributes_aligned_multiple = this._options.wrap_attributes === "aligned-multiple";
      this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr(0, "preserve".length) === "preserve";
      this._is_wrap_attributes_preserve_aligned = this._options.wrap_attributes === "preserve-aligned";
    }
    Beautifier.prototype.beautify = function() {
      if (this._options.disabled) {
        return this._source_text;
      }
      var source_text = this._source_text;
      var eol = this._options.eol;
      if (this._options.eol === "auto") {
        eol = "\n";
        if (source_text && lineBreak.test(source_text)) {
          eol = source_text.match(lineBreak)[0];
        }
      }
      source_text = source_text.replace(allLineBreaks, "\n");
      var baseIndentString = source_text.match(/^[\t ]*/)[0];
      var last_token = {
        text: "",
        type: ""
      };
      var last_tag_token = new TagOpenParserToken(this._options);
      var printer = new Printer(this._options, baseIndentString);
      var tokens = new Tokenizer(source_text, this._options).tokenize();
      this._tag_stack = new TagStack(printer);
      var parser_token = null;
      var raw_token = tokens.next();
      while (raw_token.type !== TOKEN.EOF) {
        if (raw_token.type === TOKEN.TAG_OPEN || raw_token.type === TOKEN.COMMENT) {
          parser_token = this._handle_tag_open(printer, raw_token, last_tag_token, last_token, tokens);
          last_tag_token = parser_token;
        } else if (raw_token.type === TOKEN.ATTRIBUTE || raw_token.type === TOKEN.EQUALS || raw_token.type === TOKEN.VALUE || raw_token.type === TOKEN.TEXT && !last_tag_token.tag_complete) {
          parser_token = this._handle_inside_tag(printer, raw_token, last_tag_token, last_token);
        } else if (raw_token.type === TOKEN.TAG_CLOSE) {
          parser_token = this._handle_tag_close(printer, raw_token, last_tag_token);
        } else if (raw_token.type === TOKEN.TEXT) {
          parser_token = this._handle_text(printer, raw_token, last_tag_token);
        } else if (raw_token.type === TOKEN.CONTROL_FLOW_OPEN) {
          parser_token = this._handle_control_flow_open(printer, raw_token);
        } else if (raw_token.type === TOKEN.CONTROL_FLOW_CLOSE) {
          parser_token = this._handle_control_flow_close(printer, raw_token);
        } else {
          printer.add_raw_token(raw_token);
        }
        last_token = parser_token;
        raw_token = tokens.next();
      }
      var sweet_code = printer._output.get_code(eol);
      return sweet_code;
    };
    Beautifier.prototype._handle_control_flow_open = function(printer, raw_token) {
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
      if (raw_token.newlines) {
        printer.print_preserved_newlines(raw_token);
      } else {
        printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
      }
      printer.print_token(raw_token);
      printer.indent();
      return parser_token;
    };
    Beautifier.prototype._handle_control_flow_close = function(printer, raw_token) {
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.deindent();
      if (raw_token.newlines) {
        printer.print_preserved_newlines(raw_token);
      } else {
        printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
      }
      printer.print_token(raw_token);
      return parser_token;
    };
    Beautifier.prototype._handle_tag_close = function(printer, raw_token, last_tag_token) {
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.alignment_size = 0;
      last_tag_token.tag_complete = true;
      printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
      if (last_tag_token.is_unformatted) {
        printer.add_raw_token(raw_token);
      } else {
        if (last_tag_token.tag_start_char === "<") {
          printer.set_space_before_token(raw_token.text[0] === "/", true);
          if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.has_wrapped_attrs) {
            printer.print_newline(false);
          }
        }
        printer.print_token(raw_token);
      }
      if (last_tag_token.indent_content && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
        printer.indent();
        last_tag_token.indent_content = false;
      }
      if (!last_tag_token.is_inline_element && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
        printer.set_wrap_point();
      }
      return parser_token;
    };
    Beautifier.prototype._handle_inside_tag = function(printer, raw_token, last_tag_token, last_token) {
      var wrapped = last_tag_token.has_wrapped_attrs;
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
      if (last_tag_token.is_unformatted) {
        printer.add_raw_token(raw_token);
      } else if (last_tag_token.tag_start_char === "{" && raw_token.type === TOKEN.TEXT) {
        if (printer.print_preserved_newlines(raw_token)) {
          raw_token.newlines = 0;
          printer.add_raw_token(raw_token);
        } else {
          printer.print_token(raw_token);
        }
      } else {
        if (raw_token.type === TOKEN.ATTRIBUTE) {
          printer.set_space_before_token(true);
        } else if (raw_token.type === TOKEN.EQUALS) {
          printer.set_space_before_token(false);
        } else if (raw_token.type === TOKEN.VALUE && raw_token.previous.type === TOKEN.EQUALS) {
          printer.set_space_before_token(false);
        }
        if (raw_token.type === TOKEN.ATTRIBUTE && last_tag_token.tag_start_char === "<") {
          if (this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) {
            printer.traverse_whitespace(raw_token);
            wrapped = wrapped || raw_token.newlines !== 0;
          }
          if (this._is_wrap_attributes_force && last_tag_token.attr_count >= this._options.wrap_attributes_min_attrs && (last_token.type !== TOKEN.TAG_OPEN || // ie. second attribute and beyond
          this._is_wrap_attributes_force_expand_multiline)) {
            printer.print_newline(false);
            wrapped = true;
          }
        }
        printer.print_token(raw_token);
        wrapped = wrapped || printer.previous_token_wrapped();
        last_tag_token.has_wrapped_attrs = wrapped;
      }
      return parser_token;
    };
    Beautifier.prototype._handle_text = function(printer, raw_token, last_tag_token) {
      var parser_token = {
        text: raw_token.text,
        type: "TK_CONTENT"
      };
      if (last_tag_token.custom_beautifier_name) {
        this._print_custom_beatifier_text(printer, raw_token, last_tag_token);
      } else if (last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) {
        printer.add_raw_token(raw_token);
      } else {
        printer.traverse_whitespace(raw_token);
        printer.print_token(raw_token);
      }
      return parser_token;
    };
    Beautifier.prototype._print_custom_beatifier_text = function(printer, raw_token, last_tag_token) {
      var local = this;
      if (raw_token.text !== "") {
        var text = raw_token.text, _beautifier, script_indent_level = 1, pre = "", post = "";
        if (last_tag_token.custom_beautifier_name === "javascript" && typeof this._js_beautify === "function") {
          _beautifier = this._js_beautify;
        } else if (last_tag_token.custom_beautifier_name === "css" && typeof this._css_beautify === "function") {
          _beautifier = this._css_beautify;
        } else if (last_tag_token.custom_beautifier_name === "html") {
          _beautifier = function(html_source, options) {
            var beautifier = new Beautifier(html_source, options, local._js_beautify, local._css_beautify);
            return beautifier.beautify();
          };
        }
        if (this._options.indent_scripts === "keep") {
          script_indent_level = 0;
        } else if (this._options.indent_scripts === "separate") {
          script_indent_level = -printer.indent_level;
        }
        var indentation = printer.get_full_indent(script_indent_level);
        text = text.replace(/\n[ \t]*$/, "");
        if (last_tag_token.custom_beautifier_name !== "html" && text[0] === "<" && text.match(/^(<!--|<!\[CDATA\[)/)) {
          var matched = /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(text);
          if (!matched) {
            printer.add_raw_token(raw_token);
            return;
          }
          pre = indentation + matched[1] + "\n";
          text = matched[4];
          if (matched[5]) {
            post = indentation + matched[5];
          }
          text = text.replace(/\n[ \t]*$/, "");
          if (matched[2] || matched[3].indexOf("\n") !== -1) {
            matched = matched[3].match(/[ \t]+$/);
            if (matched) {
              raw_token.whitespace_before = matched[0];
            }
          }
        }
        if (text) {
          if (_beautifier) {
            var Child_options = function() {
              this.eol = "\n";
            };
            Child_options.prototype = this._options.raw_options;
            var child_options = new Child_options();
            text = _beautifier(indentation + text, child_options);
          } else {
            var white = raw_token.whitespace_before;
            if (white) {
              text = text.replace(new RegExp("\n(" + white + ")?", "g"), "\n");
            }
            text = indentation + text.replace(/\n/g, "\n" + indentation);
          }
        }
        if (pre) {
          if (!text) {
            text = pre + post;
          } else {
            text = pre + text + "\n" + post;
          }
        }
        printer.print_newline(false);
        if (text) {
          raw_token.text = text;
          raw_token.whitespace_before = "";
          raw_token.newlines = 0;
          printer.add_raw_token(raw_token);
          printer.print_newline(true);
        }
      }
    };
    Beautifier.prototype._handle_tag_open = function(printer, raw_token, last_tag_token, last_token, tokens) {
      var parser_token = this._get_tag_open_token(raw_token);
      if ((last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) && !last_tag_token.is_empty_element && raw_token.type === TOKEN.TAG_OPEN && !parser_token.is_start_tag) {
        printer.add_raw_token(raw_token);
        parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
      } else {
        printer.traverse_whitespace(raw_token);
        this._set_tag_position(printer, raw_token, parser_token, last_tag_token, last_token);
        if (!parser_token.is_inline_element) {
          printer.set_wrap_point();
        }
        printer.print_token(raw_token);
      }
      if (parser_token.is_start_tag && this._is_wrap_attributes_force) {
        var peek_index = 0;
        var peek_token;
        do {
          peek_token = tokens.peek(peek_index);
          if (peek_token.type === TOKEN.ATTRIBUTE) {
            parser_token.attr_count += 1;
          }
          peek_index += 1;
        } while (peek_token.type !== TOKEN.EOF && peek_token.type !== TOKEN.TAG_CLOSE);
      }
      if (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) {
        parser_token.alignment_size = raw_token.text.length + 1;
      }
      if (!parser_token.tag_complete && !parser_token.is_unformatted) {
        printer.alignment_size = parser_token.alignment_size;
      }
      return parser_token;
    };
    var TagOpenParserToken = function(options, parent, raw_token) {
      this.parent = parent || null;
      this.text = "";
      this.type = "TK_TAG_OPEN";
      this.tag_name = "";
      this.is_inline_element = false;
      this.is_unformatted = false;
      this.is_content_unformatted = false;
      this.is_empty_element = false;
      this.is_start_tag = false;
      this.is_end_tag = false;
      this.indent_content = false;
      this.multiline_content = false;
      this.custom_beautifier_name = null;
      this.start_tag_token = null;
      this.attr_count = 0;
      this.has_wrapped_attrs = false;
      this.alignment_size = 0;
      this.tag_complete = false;
      this.tag_start_char = "";
      this.tag_check = "";
      if (!raw_token) {
        this.tag_complete = true;
      } else {
        var tag_check_match;
        this.tag_start_char = raw_token.text[0];
        this.text = raw_token.text;
        if (this.tag_start_char === "<") {
          tag_check_match = raw_token.text.match(/^<([^\s>]*)/);
          this.tag_check = tag_check_match ? tag_check_match[1] : "";
        } else {
          tag_check_match = raw_token.text.match(/^{{~?(?:[\^]|#\*?)?([^\s}]+)/);
          this.tag_check = tag_check_match ? tag_check_match[1] : "";
          if ((raw_token.text.startsWith("{{#>") || raw_token.text.startsWith("{{~#>")) && this.tag_check[0] === ">") {
            if (this.tag_check === ">" && raw_token.next !== null) {
              this.tag_check = raw_token.next.text.split(" ")[0];
            } else {
              this.tag_check = raw_token.text.split(">")[1];
            }
          }
        }
        this.tag_check = this.tag_check.toLowerCase();
        if (raw_token.type === TOKEN.COMMENT) {
          this.tag_complete = true;
        }
        this.is_start_tag = this.tag_check.charAt(0) !== "/";
        this.tag_name = !this.is_start_tag ? this.tag_check.substr(1) : this.tag_check;
        this.is_end_tag = !this.is_start_tag || raw_token.closed && raw_token.closed.text === "/>";
        var handlebar_starts = 2;
        if (this.tag_start_char === "{" && this.text.length >= 3) {
          if (this.text.charAt(2) === "~") {
            handlebar_starts = 3;
          }
        }
        this.is_end_tag = this.is_end_tag || this.tag_start_char === "{" && (!options.indent_handlebars || this.text.length < 3 || /[^#\^]/.test(this.text.charAt(handlebar_starts)));
      }
    };
    Beautifier.prototype._get_tag_open_token = function(raw_token) {
      var parser_token = new TagOpenParserToken(this._options, this._tag_stack.get_parser_token(), raw_token);
      parser_token.alignment_size = this._options.wrap_attributes_indent_size;
      parser_token.is_end_tag = parser_token.is_end_tag || in_array(parser_token.tag_check, this._options.void_elements);
      parser_token.is_empty_element = parser_token.tag_complete || parser_token.is_start_tag && parser_token.is_end_tag;
      parser_token.is_unformatted = !parser_token.tag_complete && in_array(parser_token.tag_check, this._options.unformatted);
      parser_token.is_content_unformatted = !parser_token.is_empty_element && in_array(parser_token.tag_check, this._options.content_unformatted);
      parser_token.is_inline_element = in_array(parser_token.tag_name, this._options.inline) || this._options.inline_custom_elements && parser_token.tag_name.includes("-") || parser_token.tag_start_char === "{";
      return parser_token;
    };
    Beautifier.prototype._set_tag_position = function(printer, raw_token, parser_token, last_tag_token, last_token) {
      if (!parser_token.is_empty_element) {
        if (parser_token.is_end_tag) {
          parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
        } else {
          if (this._do_optional_end_element(parser_token)) {
            if (!parser_token.is_inline_element) {
              printer.print_newline(false);
            }
          }
          this._tag_stack.record_tag(parser_token);
          if ((parser_token.tag_name === "script" || parser_token.tag_name === "style") && !(parser_token.is_unformatted || parser_token.is_content_unformatted)) {
            parser_token.custom_beautifier_name = get_custom_beautifier_name(parser_token.tag_check, raw_token);
          }
        }
      }
      if (in_array(parser_token.tag_check, this._options.extra_liners)) {
        printer.print_newline(false);
        if (!printer._output.just_added_blankline()) {
          printer.print_newline(true);
        }
      }
      if (parser_token.is_empty_element) {
        if (parser_token.tag_start_char === "{" && parser_token.tag_check === "else") {
          this._tag_stack.indent_to_tag(["if", "unless", "each"]);
          parser_token.indent_content = true;
          var foundIfOnCurrentLine = printer.current_line_has_match(/{{#if/);
          if (!foundIfOnCurrentLine) {
            printer.print_newline(false);
          }
        }
        if (parser_token.tag_name === "!--" && last_token.type === TOKEN.TAG_CLOSE && last_tag_token.is_end_tag && parser_token.text.indexOf("\n") === -1) {
        } else {
          if (!(parser_token.is_inline_element || parser_token.is_unformatted)) {
            printer.print_newline(false);
          }
          this._calcluate_parent_multiline(printer, parser_token);
        }
      } else if (parser_token.is_end_tag) {
        var do_end_expand = false;
        do_end_expand = parser_token.start_tag_token && parser_token.start_tag_token.multiline_content;
        do_end_expand = do_end_expand || !parser_token.is_inline_element && !(last_tag_token.is_inline_element || last_tag_token.is_unformatted) && !(last_token.type === TOKEN.TAG_CLOSE && parser_token.start_tag_token === last_tag_token) && last_token.type !== "TK_CONTENT";
        if (parser_token.is_content_unformatted || parser_token.is_unformatted) {
          do_end_expand = false;
        }
        if (do_end_expand) {
          printer.print_newline(false);
        }
      } else {
        parser_token.indent_content = !parser_token.custom_beautifier_name;
        if (parser_token.tag_start_char === "<") {
          if (parser_token.tag_name === "html") {
            parser_token.indent_content = this._options.indent_inner_html;
          } else if (parser_token.tag_name === "head") {
            parser_token.indent_content = this._options.indent_head_inner_html;
          } else if (parser_token.tag_name === "body") {
            parser_token.indent_content = this._options.indent_body_inner_html;
          }
        }
        if (!(parser_token.is_inline_element || parser_token.is_unformatted) && (last_token.type !== "TK_CONTENT" || parser_token.is_content_unformatted)) {
          printer.print_newline(false);
        }
        this._calcluate_parent_multiline(printer, parser_token);
      }
    };
    Beautifier.prototype._calcluate_parent_multiline = function(printer, parser_token) {
      if (parser_token.parent && printer._output.just_added_newline() && !((parser_token.is_inline_element || parser_token.is_unformatted) && parser_token.parent.is_inline_element)) {
        parser_token.parent.multiline_content = true;
      }
    };
    var p_closers = ["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "menu", "nav", "ol", "p", "pre", "section", "table", "ul"];
    var p_parent_excludes = ["a", "audio", "del", "ins", "map", "noscript", "video"];
    Beautifier.prototype._do_optional_end_element = function(parser_token) {
      var result = null;
      if (parser_token.is_empty_element || !parser_token.is_start_tag || !parser_token.parent) {
        return;
      }
      if (parser_token.tag_name === "body") {
        result = result || this._tag_stack.try_pop("head");
      } else if (parser_token.tag_name === "li") {
        result = result || this._tag_stack.try_pop("li", ["ol", "ul", "menu"]);
      } else if (parser_token.tag_name === "dd" || parser_token.tag_name === "dt") {
        result = result || this._tag_stack.try_pop("dt", ["dl"]);
        result = result || this._tag_stack.try_pop("dd", ["dl"]);
      } else if (parser_token.parent.tag_name === "p" && p_closers.indexOf(parser_token.tag_name) !== -1) {
        var p_parent = parser_token.parent.parent;
        if (!p_parent || p_parent_excludes.indexOf(p_parent.tag_name) === -1) {
          result = result || this._tag_stack.try_pop("p");
        }
      } else if (parser_token.tag_name === "rp" || parser_token.tag_name === "rt") {
        result = result || this._tag_stack.try_pop("rt", ["ruby", "rtc"]);
        result = result || this._tag_stack.try_pop("rp", ["ruby", "rtc"]);
      } else if (parser_token.tag_name === "optgroup") {
        result = result || this._tag_stack.try_pop("optgroup", ["select"]);
      } else if (parser_token.tag_name === "option") {
        result = result || this._tag_stack.try_pop("option", ["select", "datalist", "optgroup"]);
      } else if (parser_token.tag_name === "colgroup") {
        result = result || this._tag_stack.try_pop("caption", ["table"]);
      } else if (parser_token.tag_name === "thead") {
        result = result || this._tag_stack.try_pop("caption", ["table"]);
        result = result || this._tag_stack.try_pop("colgroup", ["table"]);
      } else if (parser_token.tag_name === "tbody" || parser_token.tag_name === "tfoot") {
        result = result || this._tag_stack.try_pop("caption", ["table"]);
        result = result || this._tag_stack.try_pop("colgroup", ["table"]);
        result = result || this._tag_stack.try_pop("thead", ["table"]);
        result = result || this._tag_stack.try_pop("tbody", ["table"]);
      } else if (parser_token.tag_name === "tr") {
        result = result || this._tag_stack.try_pop("caption", ["table"]);
        result = result || this._tag_stack.try_pop("colgroup", ["table"]);
        result = result || this._tag_stack.try_pop("tr", ["table", "thead", "tbody", "tfoot"]);
      } else if (parser_token.tag_name === "th" || parser_token.tag_name === "td") {
        result = result || this._tag_stack.try_pop("td", ["table", "thead", "tbody", "tfoot", "tr"]);
        result = result || this._tag_stack.try_pop("th", ["table", "thead", "tbody", "tfoot", "tr"]);
      }
      parser_token.parent = this._tag_stack.get_parser_token();
      return result;
    };
    module2.exports.Beautifier = Beautifier;
  }
});

// node_modules/js-beautify/js/src/html/index.js
var require_html = __commonJS({
  "node_modules/js-beautify/js/src/html/index.js"(exports2, module2) {
    "use strict";
    var Beautifier = require_beautifier3().Beautifier;
    var Options = require_options4().Options;
    function style_html(html_source, options, js_beautify2, css_beautify) {
      var beautifier = new Beautifier(html_source, options, js_beautify2, css_beautify);
      return beautifier.beautify();
    }
    module2.exports = style_html;
    module2.exports.defaultOptions = function() {
      return new Options();
    };
  }
});

// node_modules/js-beautify/js/src/index.js
var require_src = __commonJS({
  "node_modules/js-beautify/js/src/index.js"(exports2, module2) {
    "use strict";
    var js_beautify2 = require_javascript();
    var css_beautify = require_css();
    var html_beautify = require_html();
    function style_html(html_source, options, js, css) {
      js = js || js_beautify2;
      css = css || css_beautify;
      return html_beautify(html_source, options, js, css);
    }
    style_html.defaultOptions = html_beautify.defaultOptions;
    module2.exports.js = js_beautify2;
    module2.exports.css = css_beautify;
    module2.exports.html = style_html;
  }
});

// node_modules/js-beautify/js/index.js
var require_js = __commonJS({
  "node_modules/js-beautify/js/index.js"(exports2, module2) {
    "use strict";
    function get_beautify(js_beautify2, css_beautify, html_beautify) {
      var beautify = function(src, config) {
        return js_beautify2.js_beautify(src, config);
      };
      beautify.js = js_beautify2.js_beautify;
      beautify.css = css_beautify.css_beautify;
      beautify.html = html_beautify.html_beautify;
      beautify.js_beautify = js_beautify2.js_beautify;
      beautify.css_beautify = css_beautify.css_beautify;
      beautify.html_beautify = html_beautify.html_beautify;
      return beautify;
    }
    if (typeof define === "function" && define.amd) {
      define([
        "./lib/beautify",
        "./lib/beautify-css",
        "./lib/beautify-html"
      ], function(js_beautify2, css_beautify, html_beautify) {
        return get_beautify(js_beautify2, css_beautify, html_beautify);
      });
    } else {
      (function(mod) {
        var beautifier = require_src();
        beautifier.js_beautify = beautifier.js;
        beautifier.css_beautify = beautifier.css;
        beautifier.html_beautify = beautifier.html;
        mod.exports = get_beautify(beautifier, beautifier, beautifier);
      })(module2);
    }
  }
});

// src/sui/sui_wasm.ts
var sui_wasm_exports = {};
__export(sui_wasm_exports, {
  Address: () => Address,
  Ascii: () => Ascii,
  Boolean: () => Boolean,
  String: () => String2,
  U128: () => U128,
  U16: () => U16,
  U256: () => U256,
  U32: () => U32,
  U64: () => U64,
  U8: () => U8,
  afterTest: () => afterTest,
  afterTestAll: () => afterTestAll,
  beforeTest: () => beforeTest,
  clone_chain_move_module: () => clone_chain_move_module,
  copy_arr_value: () => copy_arr_value,
  debug_move_function: () => debug_move_function,
  deps_init: () => deps_init,
  gen_move_ptb_scripts: () => gen_move_ptb_scripts,
  gen_move_test_scripts: () => gen_move_test_scripts,
  get_arr_bcs_vector: () => get_arr_bcs_vector,
  get_arr_deps: () => get_arr_deps,
  get_config: () => get_config,
  get_gas_cost: () => get_gas_cost,
  get_gas_report: () => get_gas_report,
  get_move_code_helper: () => get_move_code_helper,
  get_move_gen: () => get_move_gen,
  get_object_address: () => get_object_address,
  get_package_address: () => get_package_address,
  get_wasm: () => get_wasm,
  has_arr: () => has_arr,
  has_value: () => has_value,
  hexToNumArray: () => hexToNumArray,
  into_arr_bcs_vector: () => into_arr_bcs_vector,
  into_arr_value: () => into_arr_value,
  isTransactionArgument: () => isTransactionArgument,
  new_move_code_helper: () => new_move_code_helper,
  new_move_gen: () => new_move_gen,
  new_sui_client: () => new_sui_client,
  new_wasm: () => new_wasm,
  publish_move_module: () => publish_move_module,
  refresh_vm: () => refresh_vm,
  set_config: () => set_config,
  setup: () => setup,
  setup_move: () => setup_move,
  setup_move_code_helper: () => setup_move_code_helper,
  setup_move_gen: () => setup_move_gen,
  sign_execute_transaction: () => sign_execute_transaction,
  to_arr_value: () => to_arr_value,
  upgrade_move_module: () => upgrade_move_module
});
module.exports = __toCommonJS(sui_wasm_exports);

// src/sui/wasm/pkg/sui_wasm_bg.js
var sui_wasm_bg_exports = {};
__export(sui_wasm_bg_exports, {
  CallArgument: () => CallArgument,
  MoveCodeHelper: () => MoveCodeHelper,
  MoveGen: () => MoveGen,
  SuiWasm: () => SuiWasm,
  __wbg_buffer_71667b1101df19da: () => __wbg_buffer_71667b1101df19da,
  __wbg_call_75b89300dd530ca6: () => __wbg_call_75b89300dd530ca6,
  __wbg_call_d68488931693e6ee: () => __wbg_call_d68488931693e6ee,
  __wbg_crypto_ed58b8e10a292839: () => __wbg_crypto_ed58b8e10a292839,
  __wbg_error_7534b8e9a36f1ab4: () => __wbg_error_7534b8e9a36f1ab4,
  __wbg_getRandomValues_bcb4912f16000dc4: () => __wbg_getRandomValues_bcb4912f16000dc4,
  __wbg_globalThis_59c7794d9413986f: () => __wbg_globalThis_59c7794d9413986f,
  __wbg_global_04c81bad83a72129: () => __wbg_global_04c81bad83a72129,
  __wbg_log_80a50dc3901559aa: () => __wbg_log_80a50dc3901559aa,
  __wbg_mkdirpSync_0d66fcfd18078f59: () => __wbg_mkdirpSync_0d66fcfd18078f59,
  __wbg_msCrypto_0a36e2ec3a343d26: () => __wbg_msCrypto_0a36e2ec3a343d26,
  __wbg_new_8a6f238a6ece86ea: () => __wbg_new_8a6f238a6ece86ea,
  __wbg_new_9ed4506807911440: () => __wbg_new_9ed4506807911440,
  __wbg_new_a238d9fa375b8c67: () => __wbg_new_a238d9fa375b8c67,
  __wbg_new_dbb4955149975b18: () => __wbg_new_dbb4955149975b18,
  __wbg_newnoargs_fe7e106c48aadd7e: () => __wbg_newnoargs_fe7e106c48aadd7e,
  __wbg_newwithbyteoffsetandlength_a51b517eb0e8fbf4: () => __wbg_newwithbyteoffsetandlength_a51b517eb0e8fbf4,
  __wbg_newwithlength_3212948a458000db: () => __wbg_newwithlength_3212948a458000db,
  __wbg_node_02999533c4ea02e3: () => __wbg_node_02999533c4ea02e3,
  __wbg_parse_3dce16ae324c4fa7: () => __wbg_parse_3dce16ae324c4fa7,
  __wbg_process_5c1d670bc53614b8: () => __wbg_process_5c1d670bc53614b8,
  __wbg_randomFillSync_ab2cfe79ebbf2740: () => __wbg_randomFillSync_ab2cfe79ebbf2740,
  __wbg_require_79b1e9274cde3c87: () => __wbg_require_79b1e9274cde3c87,
  __wbg_self_c9a63b952bd22cbd: () => __wbg_self_c9a63b952bd22cbd,
  __wbg_set_3807d5f0bfc24aa7: () => __wbg_set_3807d5f0bfc24aa7,
  __wbg_set_e8d9380e866a1e41: () => __wbg_set_e8d9380e866a1e41,
  __wbg_set_wasm: () => __wbg_set_wasm,
  __wbg_stack_0ed75d68575b0f3c: () => __wbg_stack_0ed75d68575b0f3c,
  __wbg_stringify_af61cb825a8f0ce6: () => __wbg_stringify_af61cb825a8f0ce6,
  __wbg_subarray_361dcbbb6f7ce587: () => __wbg_subarray_361dcbbb6f7ce587,
  __wbg_versions_c71aa1626a93e0a1: () => __wbg_versions_c71aa1626a93e0a1,
  __wbg_window_81304a10d2638125: () => __wbg_window_81304a10d2638125,
  __wbg_writeFileSync_b8deeb8c05b50997: () => __wbg_writeFileSync_b8deeb8c05b50997,
  __wbindgen_debug_string: () => __wbindgen_debug_string,
  __wbindgen_init_externref_table: () => __wbindgen_init_externref_table,
  __wbindgen_is_function: () => __wbindgen_is_function,
  __wbindgen_is_object: () => __wbindgen_is_object,
  __wbindgen_is_string: () => __wbindgen_is_string,
  __wbindgen_is_undefined: () => __wbindgen_is_undefined,
  __wbindgen_memory: () => __wbindgen_memory,
  __wbindgen_string_get: () => __wbindgen_string_get,
  __wbindgen_string_new: () => __wbindgen_string_new,
  __wbindgen_throw: () => __wbindgen_throw
});

// src/sui/wasm/pkg/snippets/sui-wasm-9cb1bf37fd8cab51/call-js.js
var import_fs_extra = __toESM(require("fs-extra"));
var import_js_beautify = __toESM(require_js());
var CallJs = class {
  constructor() {
  }
  mkdirpSync(dir) {
    if (!import_fs_extra.default.existsSync(dir)) {
      import_fs_extra.default.mkdirpSync(dir);
    }
  }
  writeFileSync(path2, value, need_beautify) {
    if (need_beautify) {
      value = (0, import_js_beautify.default)(value);
    }
    import_fs_extra.default.writeFileSync(path2, value);
  }
};

// src/sui/wasm/pkg/sui_wasm_bg.js
var wasm;
function __wbg_set_wasm(val) {
  wasm = val;
}
function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_export_2.set(idx, obj);
  return idx;
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}
var lTextDecoder = typeof TextDecoder === "undefined" ? (0, module.require)("util").TextDecoder : TextDecoder;
var cachedTextDecoder = new lTextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
var WASM_VECTOR_LEN = 0;
var lTextEncoder = typeof TextEncoder === "undefined" ? (0, module.require)("util").TextEncoder : TextEncoder;
var cachedTextEncoder = new lTextEncoder("utf-8");
var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
var cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_2.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0;
  for (let i = 0; i < array.length; i++) {
    const add = addToExternrefTable0(array[i]);
    getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
  }
  WASM_VECTOR_LEN = array.length;
  return ptr;
}
function getArrayJsValueFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  const mem = getDataViewMemory0();
  const result = [];
  for (let i = ptr; i < ptr + 4 * len; i += 4) {
    result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
  }
  wasm.__externref_drop_slice(ptr, len);
  return result;
}
var CallArgumentFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_callargument_free(ptr >>> 0, 1));
var CallArgument = class {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    CallArgumentFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_callargument_free(ptr, 0);
  }
  /**
   * @param {Uint8Array} bytes
   * @param {string} type_tag
   * @returns {CallArgument}
   */
  static new_bytes(bytes2, type_tag) {
    const ptr0 = passArray8ToWasm0(bytes2, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(type_tag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.callargument_new_bytes(ptr0, len0, ptr1, len1);
    return ret;
  }
};
var MoveCodeHelperFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_movecodehelper_free(ptr >>> 0, 1));
var MoveCodeHelper = class _MoveCodeHelper {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_MoveCodeHelper.prototype);
    obj.__wbg_ptr = ptr;
    MoveCodeHelperFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    MoveCodeHelperFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_movecodehelper_free(ptr, 0);
  }
  /**
   * @returns {MoveCodeHelper}
   */
  static new() {
    const ret = wasm.movecodehelper_new();
    return _MoveCodeHelper.__wrap(ret);
  }
  /**
   * @param {string} module
   * @param {Uint8Array} binary
   */
  register_module(module2, binary) {
    const ptr0 = passStringToWasm0(module2, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(binary, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.movecodehelper_register_module(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  build_bytecode_model() {
    const ret = wasm.movecodehelper_build_bytecode_model(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @returns {string}
   */
  get_package_info() {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.movecodehelper_get_package_info(this.__wbg_ptr);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @returns {string}
   */
  get_modules() {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.movecodehelper_get_modules(this.__wbg_ptr);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_functions(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_functions(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_structs(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_structs(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_dependencies(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_dependencies(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_friends(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_friends(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_named_constants(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_named_constants(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_objects(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_objects(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @param {boolean} transitive
   * @returns {string}
   */
  get_shared_objects(module_name, transitive) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_shared_objects(this.__wbg_ptr, ptr0, len0, transitive);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @param {boolean} transitive
   * @returns {string}
   */
  get_transferred_objects(module_name, transitive) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_transferred_objects(this.__wbg_ptr, ptr0, len0, transitive);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @param {boolean} transitive
   * @returns {string}
   */
  get_frozen_objects(module_name, transitive) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_frozen_objects(this.__wbg_ptr, ptr0, len0, transitive);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @param {boolean} transitive
   * @returns {string}
   */
  get_events(module_name, transitive) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_events(this.__wbg_ptr, ptr0, len0, transitive);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  disassemble(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_disassemble(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @param {string} func_name
   * @returns {string}
   */
  disassemble_function(module_name, func_name) {
    let deferred4_0;
    let deferred4_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(func_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_disassemble_function(this.__wbg_ptr, ptr0, len0, ptr1, len1);
      var ptr3 = ret[0];
      var len3 = ret[1];
      if (ret[3]) {
        ptr3 = 0;
        len3 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred4_0 = ptr3;
      deferred4_1 = len3;
      return getStringFromWasm0(ptr3, len3);
    } finally {
      wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @param {string} func_name
   * @returns {string}
   */
  disassemble_function_body(module_name, func_name) {
    let deferred4_0;
    let deferred4_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(func_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_disassemble_function_body(this.__wbg_ptr, ptr0, len0, ptr1, len1);
      var ptr3 = ret[0];
      var len3 = ret[1];
      if (ret[3]) {
        ptr3 = 0;
        len3 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred4_0 = ptr3;
      deferred4_1 = len3;
      return getStringFromWasm0(ptr3, len3);
    } finally {
      wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @param {string} struct_name
   * @returns {string}
   */
  disassemble_struct(module_name, struct_name) {
    let deferred4_0;
    let deferred4_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(struct_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_disassemble_struct(this.__wbg_ptr, ptr0, len0, ptr1, len1);
      var ptr3 = ret[0];
      var len3 = ret[1];
      if (ret[3]) {
        ptr3 = 0;
        len3 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred4_0 = ptr3;
      deferred4_1 = len3;
      return getStringFromWasm0(ptr3, len3);
    } finally {
      wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  move_disassemble(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_move_disassemble(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_otw_structs(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_otw_structs(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_tx_context_functions(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_tx_context_functions(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_entry_functions(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_entry_functions(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_private_functions(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_private_functions(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_friend_functions(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_friend_functions(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_public_functions(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_public_functions(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  get_phantom_structs(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_get_phantom_structs(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  unused_private_functions(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_unused_private_functions(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  unused_constant(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_unused_constant(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * @param {string} module_name
   * @returns {string}
   */
  unchecked_return(module_name) {
    let deferred3_0;
    let deferred3_1;
    try {
      const ptr0 = passStringToWasm0(module_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.movecodehelper_unchecked_return(this.__wbg_ptr, ptr0, len0);
      var ptr2 = ret[0];
      var len2 = ret[1];
      if (ret[3]) {
        ptr2 = 0;
        len2 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
  }
};
var MoveGenFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_movegen_free(ptr >>> 0, 1));
var MoveGen = class _MoveGen {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_MoveGen.prototype);
    obj.__wbg_ptr = ptr;
    MoveGenFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    MoveGenFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_movegen_free(ptr, 0);
  }
  /**
   * @returns {MoveGen}
   */
  static new() {
    const ret = wasm.movegen_new();
    return _MoveGen.__wrap(ret);
  }
  /**
   * @param {string} toml_string
   * @param {string} key0
   * @param {string} key1
   * @param {string} key2
   * @param {string} value1
   * @returns {string}
   */
  static toml_edit_dependencies(toml_string, key0, key1, key2, value1) {
    let deferred7_0;
    let deferred7_1;
    try {
      const ptr0 = passStringToWasm0(toml_string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(key0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passStringToWasm0(key1, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len2 = WASM_VECTOR_LEN;
      const ptr3 = passStringToWasm0(key2, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len3 = WASM_VECTOR_LEN;
      const ptr4 = passStringToWasm0(value1, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len4 = WASM_VECTOR_LEN;
      const ret = wasm.movegen_toml_edit_dependencies(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4);
      var ptr6 = ret[0];
      var len6 = ret[1];
      if (ret[3]) {
        ptr6 = 0;
        len6 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred7_0 = ptr6;
      deferred7_1 = len6;
      return getStringFromWasm0(ptr6, len6);
    } finally {
      wasm.__wbindgen_free(deferred7_0, deferred7_1, 1);
    }
  }
  /**
   * @param {string} module
   * @param {Uint8Array} binary
   */
  register_module(module2, binary) {
    const ptr0 = passStringToWasm0(module2, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(binary, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.movegen_register_module(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  build_bytecode_model() {
    const ret = wasm.movegen_build_bytecode_model(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} out
   */
  run_move_gen(out) {
    const ptr0 = passStringToWasm0(out, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.movegen_run_move_gen(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} out
   */
  run_move_tx_gen(out) {
    const ptr0 = passStringToWasm0(out, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.movegen_run_move_tx_gen(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} out
   * @param {string} package_id
   * @param {Uint8Array} binary
   */
  run_module_gen(out, package_id, binary) {
    const ptr0 = passStringToWasm0(out, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(package_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArray8ToWasm0(binary, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.movegen_run_module_gen(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
};
var SuiWasmFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_suiwasm_free(ptr >>> 0, 1));
var SuiWasm = class _SuiWasm {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_SuiWasm.prototype);
    obj.__wbg_ptr = ptr;
    SuiWasmFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    SuiWasmFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_suiwasm_free(ptr, 0);
  }
  /**
   * @param {Uint8Array} bytes
   * @param {string} type_tag
   * @returns {CallArgument}
   */
  new_bytes(bytes2, type_tag) {
    const ptr0 = passArray8ToWasm0(bytes2, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(type_tag, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.suiwasm_new_bytes(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    return ret;
  }
  /**
   * @returns {SuiWasm}
   */
  static new_wasm() {
    const ret = wasm.suiwasm_new_wasm();
    return _SuiWasm.__wrap(ret);
  }
  /**
   * @param {boolean} v
   * @param {string} trace_location
   */
  set_tracer_enable(v, trace_location) {
    const ptr0 = passStringToWasm0(trace_location, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.suiwasm_set_tracer_enable(this.__wbg_ptr, v, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  reset_gas_cost() {
    const ret = wasm.suiwasm_reset_gas_cost(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @returns {bigint}
   */
  get_gas_cost() {
    const ret = wasm.suiwasm_get_gas_cost(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
  }
  /**
   * @returns {string}
   */
  get_gas_report() {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.suiwasm_get_gas_report(this.__wbg_ptr);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  refresh_vm() {
    const ret = wasm.suiwasm_refresh_vm(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {Uint8Array} binary
   */
  publish_module(binary) {
    const ptr0 = passArray8ToWasm0(binary, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.suiwasm_publish_module(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  setup_storage() {
    const ret = wasm.suiwasm_setup_storage(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {Uint8Array} binary
   */
  add_source_map(binary) {
    const ptr0 = passArray8ToWasm0(binary, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.suiwasm_add_source_map(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} json
   */
  add_source_map_json(json) {
    const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.suiwasm_add_source_map_json(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} code
   */
  add_source_code(code) {
    const ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.suiwasm_add_source_code(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} account_address
   * @param {string} module
   * @param {string} _function
   * @param {string[]} ty_args
   * @param {CallArgument[]} args
   * @returns {CallArgument[]}
   */
  call_return_bcs(account_address, module2, _function, ty_args, args) {
    const ptr0 = passStringToWasm0(account_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(module2, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(_function, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passArrayJsValueToWasm0(ty_args, wasm.__wbindgen_malloc);
    const len3 = WASM_VECTOR_LEN;
    const ptr4 = passArrayJsValueToWasm0(args, wasm.__wbindgen_malloc);
    const len4 = WASM_VECTOR_LEN;
    const ret = wasm.suiwasm_call_return_bcs(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4);
    if (ret[3]) {
      throw takeFromExternrefTable0(ret[2]);
    }
    var v6 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v6;
  }
};
function __wbg_buffer_71667b1101df19da(arg0) {
  const ret = arg0.buffer;
  return ret;
}
function __wbg_call_75b89300dd530ca6() {
  return handleError(function(arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
  }, arguments);
}
function __wbg_call_d68488931693e6ee() {
  return handleError(function(arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
  }, arguments);
}
function __wbg_crypto_ed58b8e10a292839(arg0) {
  const ret = arg0.crypto;
  return ret;
}
function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
  let deferred0_0;
  let deferred0_1;
  try {
    deferred0_0 = arg0;
    deferred0_1 = arg1;
    console.error(getStringFromWasm0(arg0, arg1));
  } finally {
    wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
  }
}
function __wbg_getRandomValues_bcb4912f16000dc4() {
  return handleError(function(arg0, arg1) {
    arg0.getRandomValues(arg1);
  }, arguments);
}
function __wbg_globalThis_59c7794d9413986f() {
  return handleError(function() {
    const ret = globalThis.globalThis;
    return ret;
  }, arguments);
}
function __wbg_global_04c81bad83a72129() {
  return handleError(function() {
    const ret = global.global;
    return ret;
  }, arguments);
}
function __wbg_log_80a50dc3901559aa(arg0) {
  console.log(arg0);
}
function __wbg_mkdirpSync_0d66fcfd18078f59(arg0, arg1, arg2) {
  let deferred0_0;
  let deferred0_1;
  try {
    deferred0_0 = arg1;
    deferred0_1 = arg2;
    arg0.mkdirpSync(getStringFromWasm0(arg1, arg2));
  } finally {
    wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
  }
}
function __wbg_msCrypto_0a36e2ec3a343d26(arg0) {
  const ret = arg0.msCrypto;
  return ret;
}
function __wbg_new_8a6f238a6ece86ea() {
  const ret = new Error();
  return ret;
}
function __wbg_new_9ed4506807911440(arg0) {
  const ret = new Uint8Array(arg0);
  return ret;
}
function __wbg_new_a238d9fa375b8c67() {
  const ret = new CallJs();
  return ret;
}
function __wbg_new_dbb4955149975b18() {
  const ret = new Object();
  return ret;
}
function __wbg_newnoargs_fe7e106c48aadd7e(arg0, arg1) {
  const ret = new Function(getStringFromWasm0(arg0, arg1));
  return ret;
}
function __wbg_newwithbyteoffsetandlength_a51b517eb0e8fbf4(arg0, arg1, arg2) {
  const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}
function __wbg_newwithlength_3212948a458000db(arg0) {
  const ret = new Uint8Array(arg0 >>> 0);
  return ret;
}
function __wbg_node_02999533c4ea02e3(arg0) {
  const ret = arg0.node;
  return ret;
}
function __wbg_parse_3dce16ae324c4fa7() {
  return handleError(function(arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return ret;
  }, arguments);
}
function __wbg_process_5c1d670bc53614b8(arg0) {
  const ret = arg0.process;
  return ret;
}
function __wbg_randomFillSync_ab2cfe79ebbf2740() {
  return handleError(function(arg0, arg1) {
    arg0.randomFillSync(arg1);
  }, arguments);
}
function __wbg_require_79b1e9274cde3c87() {
  return handleError(function() {
    const ret = module.require;
    return ret;
  }, arguments);
}
function __wbg_self_c9a63b952bd22cbd() {
  return handleError(function() {
    const ret = self.self;
    return ret;
  }, arguments);
}
function __wbg_set_3807d5f0bfc24aa7(arg0, arg1, arg2) {
  arg0[arg1] = arg2;
}
function __wbg_set_e8d9380e866a1e41(arg0, arg1, arg2) {
  arg0.set(arg1, arg2 >>> 0);
}
function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
  const ret = arg1.stack;
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
function __wbg_stringify_af61cb825a8f0ce6() {
  return handleError(function(arg0) {
    const ret = JSON.stringify(arg0);
    return ret;
  }, arguments);
}
function __wbg_subarray_361dcbbb6f7ce587(arg0, arg1, arg2) {
  const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
  return ret;
}
function __wbg_versions_c71aa1626a93e0a1(arg0) {
  const ret = arg0.versions;
  return ret;
}
function __wbg_window_81304a10d2638125() {
  return handleError(function() {
    const ret = window.window;
    return ret;
  }, arguments);
}
function __wbg_writeFileSync_b8deeb8c05b50997(arg0, arg1, arg2, arg3, arg4, arg5) {
  let deferred0_0;
  let deferred0_1;
  let deferred1_0;
  let deferred1_1;
  try {
    deferred0_0 = arg1;
    deferred0_1 = arg2;
    deferred1_0 = arg3;
    deferred1_1 = arg4;
    arg0.writeFileSync(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4), arg5 !== 0);
  } finally {
    wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
  }
}
function __wbindgen_debug_string(arg0, arg1) {
  const ret = debugString(arg1);
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
function __wbindgen_init_externref_table() {
  const table = wasm.__wbindgen_export_2;
  const offset = table.grow(4);
  table.set(0, void 0);
  table.set(offset + 0, void 0);
  table.set(offset + 1, null);
  table.set(offset + 2, true);
  table.set(offset + 3, false);
  ;
}
function __wbindgen_is_function(arg0) {
  const ret = typeof arg0 === "function";
  return ret;
}
function __wbindgen_is_object(arg0) {
  const val = arg0;
  const ret = typeof val === "object" && val !== null;
  return ret;
}
function __wbindgen_is_string(arg0) {
  const ret = typeof arg0 === "string";
  return ret;
}
function __wbindgen_is_undefined(arg0) {
  const ret = arg0 === void 0;
  return ret;
}
function __wbindgen_memory() {
  const ret = wasm.memory;
  return ret;
}
function __wbindgen_string_get(arg0, arg1) {
  const obj = arg1;
  const ret = typeof obj === "string" ? obj : void 0;
  var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return ret;
}
function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}

// src/sui/wasm/pkg/sui_wasm.js
var import_fs = __toESM(require("fs"));
var import_node_path = require("path");
var import_node_url = require("url");

// src/sui/wasm/pkg/env.js
function set_env(imports) {
  imports["env"] = {};
  imports["env"]["now"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_context_preallocated_destroy"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_context_preallocated_size"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_context_preallocated_create"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ecdsa_sign_recoverable"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_context_preallocated_clone_size"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ecdsa_sign"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ecdsa_verify"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ec_seckey_verify"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ec_pubkey_create"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ec_pubkey_serialize"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ecdsa_recover"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ecdsa_signature_serialize_compact"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ecdsa_recoverable_signature_serialize_compact"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ecdsa_recoverable_signature_parse_compact"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ec_pubkey_parse"] = function() {
  };
  imports["env"]["rustsecp256k1_v0_8_1_ecdsa_signature_parse_compact"] = function() {
  };
  imports["env"]["blst_p1_add_or_double"] = function() {
  };
  imports["env"]["blst_p1_cneg"] = function() {
  };
  imports["env"]["blst_fr_inverse"] = function() {
  };
  imports["env"]["blst_scalar_from_fr"] = function() {
  };
  imports["env"]["blst_p1_mult"] = function() {
  };
  imports["env"]["blst_p1_from_affine"] = function() {
  };
  imports["env"]["blst_p1_to_affine"] = function() {
  };
  imports["env"]["blst_p2_to_affine"] = function() {
  };
  imports["env"]["blst_miller_loop"] = function() {
  };
  imports["env"]["blst_final_exp"] = function() {
  };
  imports["env"]["blst_fp12_one"] = function() {
  };
  imports["env"]["blst_hash_to_g1"] = function() {
  };
  imports["env"]["blst_p1_uncompress"] = function() {
  };
  imports["env"]["blst_p1_in_g1"] = function() {
  };
  imports["env"]["blst_p1_compress"] = function() {
  };
  imports["env"]["blst_p1_serialize"] = function() {
  };
  imports["env"]["blst_p1_deserialize"] = function() {
  };
  imports["env"]["blst_p1s_add"] = function() {
  };
  imports["env"]["blst_p2_add_or_double"] = function() {
  };
  imports["env"]["blst_p2_cneg"] = function() {
  };
  imports["env"]["blst_p2_mult"] = function() {
  };
  imports["env"]["blst_p2_from_affine"] = function() {
  };
  imports["env"]["blst_hash_to_g2"] = function() {
  };
  imports["env"]["blst_p2_uncompress"] = function() {
  };
  imports["env"]["blst_p2_in_g2"] = function() {
  };
  imports["env"]["blst_p2_compress"] = function() {
  };
  imports["env"]["blst_fp12_mul"] = function() {
  };
  imports["env"]["blst_fp12_inverse"] = function() {
  };
  imports["env"]["blst_lendian_from_scalar"] = function() {
  };
  imports["env"]["blst_fr_sub"] = function() {
  };
  imports["env"]["blst_fp12_sqr"] = function() {
  };
  imports["env"]["blst_fr_rshift"] = function() {
  };
  imports["env"]["blst_fp_from_bendian"] = function() {
  };
  imports["env"]["blst_fr_add"] = function() {
  };
  imports["env"]["blst_fr_mul"] = function() {
  };
  imports["env"]["blst_fr_from_scalar"] = function() {
  };
  imports["env"]["blst_scalar_from_bendian"] = function() {
  };
  imports["env"]["blst_scalar_fr_check"] = function() {
  };
  imports["env"]["blst_bendian_from_scalar"] = function() {
  };
  imports["env"]["blst_p2_affine_is_inf"] = function() {
  };
  imports["env"]["blst_p2_affine_in_g2"] = function() {
  };
  imports["env"]["blst_p2_deserialize"] = function() {
  };
  imports["env"]["blst_p1_affine_is_inf"] = function() {
  };
  imports["env"]["blst_p1_affine_in_g1"] = function() {
  };
  imports["env"]["blst_pairing_sizeof"] = function() {
  };
  imports["env"]["blst_pairing_init"] = function() {
  };
  imports["env"]["blst_pairing_commit"] = function() {
  };
  imports["env"]["blst_pairing_finalverify"] = function() {
  };
  imports["env"]["blst_p1_is_equal"] = function() {
  };
  imports["env"]["blst_p2_is_equal"] = function() {
  };
  imports["env"]["blst_fp12_is_equal"] = function() {
  };
  imports["env"]["blst_fp12_in_group"] = function() {
  };
  imports["env"]["blst_bendian_from_fp12"] = function() {
  };
  imports["env"]["blst_pairing_chk_n_aggr_pk_in_g2"] = function() {
  };
  imports["env"]["blst_pairing_chk_n_aggr_pk_in_g1"] = function() {
  };
  imports["env"]["blst_pairing_raw_aggregate"] = function() {
  };
  imports["env"]["blst_pairing_as_fp12"] = function() {
  };
  imports["env"]["blst_p1s_to_affine"] = function() {
  };
  imports["env"]["blst_p1s_mult_pippenger_scratch_sizeof"] = function() {
  };
  imports["env"]["blst_p1s_mult_pippenger"] = function() {
  };
  imports["env"]["blst_p2s_to_affine"] = function() {
  };
  imports["env"]["blst_p2s_mult_pippenger_scratch_sizeof"] = function() {
  };
  imports["env"]["blst_p2s_mult_pippenger"] = function() {
  };
  imports["env"]["blst_p2_affine_compress"] = function() {
  };
  imports["env"]["ring_core_0_17_8_p256_point_mul_base"] = function() {
  };
  imports["env"]["ring_core_0_17_8_p256_point_mul"] = function() {
  };
  imports["env"]["ring_core_0_17_8_p256_point_add"] = function() {
  };
  imports["env"]["ring_core_0_17_8_LIMBS_are_zero"] = function() {
  };
  let envs = [
    "ring_core_0_17_8_p256_scalar_mul_mont",
    "ring_core_0_17_8_LIMBS_less_than",
    "ring_core_0_17_8_LIMBS_are_even",
    "ring_core_0_17_8_LIMBS_less_than_limb",
    "ring_core_0_17_8_bn_neg_inv_mod_r_u64",
    "ring_core_0_17_8_x25519_ge_frombytes_vartime",
    "ring_core_0_17_8_x25519_fe_invert",
    "ring_core_0_17_8_x25519_fe_mul_ttt",
    "ring_core_0_17_8_x25519_fe_tobytes",
    "ring_core_0_17_8_x25519_fe_isnegative",
    "ring_core_0_17_8_x25519_fe_neg",
    "ring_core_0_17_8_LIMBS_shl_mod",
    "ring_core_0_17_8_p256_sqr_mont",
    "ring_core_0_17_8_p256_mul_mont",
    "ring_core_0_17_8_p256_scalar_sqr_rep_mont",
    "ring_core_0_17_8_x25519_sc_reduce",
    "ring_core_0_17_8_p384_point_mul",
    "ring_core_0_17_8_p384_point_add",
    "ring_core_0_17_8_p384_scalar_mul_mont",
    "ring_core_0_17_8_x25519_ge_double_scalarmult_vartime",
    "ring_core_0_17_8_p384_elem_mul_mont",
    "ring_core_0_17_8_LIMB_shr",
    "ring_core_0_17_8_limbs_mul_add_limb",
    "ring_core_0_17_8_bn_from_montgomery_in_place",
    "ring_core_0_17_8_LIMBS_equal",
    "ring_core_0_17_8_LIMBS_add_mod",
    "ring_core_0_17_8_LIMBS_reduce_once"
  ];
  for (var i = 0; i < envs.length; i++) {
    imports["env"][envs[i]] = function() {
    };
  }
}

// src/sui/wasm/pkg/sui_wasm.js
var import_meta = {};
var bytes_dir = "";
if (import_meta && import_meta.url) {
  bytes_dir = (0, import_node_path.dirname)((0, import_node_url.fileURLToPath)(import_meta.url));
} else {
  bytes_dir = __dirname;
}
var bytes = import_fs.default.readFileSync(bytes_dir + "/sui_wasm_bg.wasm");
var wasmModule = new WebAssembly.Module(bytes);
var funcs = [];
for (k in sui_wasm_bg_exports) {
  funcs.push(k);
}
var k;
var importObject = {
  "./sui_wasm_bg.js": {}
};
set_env(importObject);
for (i = 0; i < funcs.length; i++) {
  importObject["./sui_wasm_bg.js"][funcs[i]] = sui_wasm_bg_exports[funcs[i]];
}
var i;
var wasmInstance = new WebAssembly.Instance(wasmModule, importObject);
__wbg_set_wasm(wasmInstance.exports);

// src/sui/sui_wasm.ts
var import_cryptography2 = require("@mysten/sui/cryptography");
var import_client3 = require("@mysten/sui/client");
var import_ed255192 = require("@mysten/sui/keypairs/ed25519");

// src/sui/config.ts
var wasm_config = null;
function get_package_address(package_name) {
  if (wasm_config && wasm_config.packages && wasm_config.packages[package_name]) {
    return wasm_config.packages[package_name];
  }
  return "";
}
function get_object_address(object_key) {
  if (wasm_config && wasm_config.objects && wasm_config.objects[object_key]) {
    return wasm_config.objects[object_key];
  }
  return "";
}
function get_config() {
  return wasm_config;
}
function set_config(config) {
  if (config != void 0) {
    wasm_config = config;
  }
}

// src/sui/sui_wasm.ts
var import_dotenv = __toESM(require("dotenv"));

// src/sui/gas.ts
var import_fs_extra2 = __toESM(require("fs-extra"));
var gasRecords = {};
function beforeTest(ctx) {
  if (ctx.task && ctx.task.suite) {
    let name = ctx.task.name;
    let suite = ctx.task.suite.name;
    get_wasm().reset_gas_cost();
    if (!gasRecords[suite]) {
      gasRecords[suite] = {};
    }
    gasRecords[suite][name] = 0;
  }
}
function afterTest(ctx) {
  if (ctx.task && ctx.task.suite) {
    let name = ctx.task.name;
    let suite = ctx.task.suite.name;
    gasRecords[suite][name] = get_wasm().get_gas_cost() + "";
  }
}
function afterTestAll(ctx) {
  let dir = process.cwd() + "/.tests/gas_cost";
  if (!import_fs_extra2.default.existsSync(dir)) {
    import_fs_extra2.default.mkdirpSync(dir);
  }
  for (var suite in gasRecords) {
    let data = gasRecords[suite];
    let out2 = dir + `/${suite}.json`;
    import_fs_extra2.default.writeFileSync(out2, JSON.stringify(data, null, 2));
  }
  let gas_report_dir = process.cwd() + "/.tests/gas_report";
  if (!import_fs_extra2.default.existsSync(gas_report_dir)) {
    import_fs_extra2.default.mkdirpSync(gas_report_dir);
  }
  let out = gas_report_dir + `/${ctx.id}.json`;
  let gas_report = get_wasm().get_gas_report();
  import_fs_extra2.default.writeFileSync(out, gas_report);
}
function get_gas_cost(name, suite) {
  let dir = process.cwd() + "/.tests/gas_cost";
  let out = dir + `/${suite}.json`;
  if (import_fs_extra2.default.existsSync(out)) {
    let data = import_fs_extra2.default.readFileSync(out).toString();
    gasRecords[suite] = JSON.parse(data);
  }
  if (gasRecords[suite]) {
    return parseInt(gasRecords[suite][name]) || 0;
  }
  return 0;
}
function get_gas_report(id) {
  let gas_report_dir = process.cwd() + "/.tests/gas_report";
  let out = gas_report_dir + `/${id}.json`;
  if (import_fs_extra2.default.existsSync(out)) {
    return import_fs_extra2.default.readFileSync(out).toString();
  } else {
    return "";
  }
}

// src/sui/gen.ts
var import_fs_extra3 = __toESM(require("fs-extra"));
function gen_move_ptb_scripts(move_gen2, package_path) {
  setup_move(move_gen2, package_path, true);
  let out = package_path + "/ptb/wrappers";
  if (!import_fs_extra3.default.existsSync(out)) {
    import_fs_extra3.default.mkdirpSync(out);
  }
  move_gen2.run_move_tx_gen(out);
}
function gen_move_test_scripts(move_gen2, package_path) {
  setup_move(move_gen2, package_path, true);
  let out = package_path + "/tests/wrappers";
  if (!import_fs_extra3.default.existsSync(out)) {
    import_fs_extra3.default.mkdirpSync(out);
  }
  move_gen2.run_move_gen(out);
}

// src/sui/deps.ts
var import_smol_toml = require("smol-toml");
var import_shelljs = __toESM(require("shelljs"));
var import_fs_extra4 = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));
var STD_NAME = "sui";
async function deps_init(package_path) {
  let toml_path = package_path + "/Move.toml";
  if (!import_fs_extra4.default.existsSync(toml_path)) {
    console.error(`Unable to find package manifest at ${package_path}`);
    return;
  }
  let toml_string = import_fs_extra4.default.readFileSync(toml_path).toString();
  let toml = (0, import_smol_toml.parse)(toml_string);
  let deps_remotes = toml["dependencies-remote"];
  let deps_dir = package_path + "/deps";
  deps_dir = deps_dir.replaceAll("\\", "/");
  let deps_std_dir = package_path + `/deps/${STD_NAME}`;
  try {
    for (var dep in deps_remotes) {
      let dep_name = dep.toLowerCase();
      let dep_p = deps_remotes[dep];
      if (dep_p["git"] && dep_p["subdir"] && dep_p["rev"]) {
        let remote_git = dep_p["git"];
        let remote_subdir = dep_p["subdir"];
        let remote_rev = dep_p["rev"];
        let git_dir = `${deps_dir}/${dep_name}`;
        let deps_package_dir = `${git_dir}/${remote_subdir}`;
        let deps_toml_path = `${deps_package_dir}/Move.toml`;
        import_fs_extra4.default.removeSync(git_dir);
        import_fs_extra4.default.mkdirpSync(git_dir);
        import_shelljs.default.cd(git_dir);
        import_shelljs.default.exec("git init");
        import_shelljs.default.exec(`git remote add origin ${remote_git}`);
        import_shelljs.default.exec("git config core.sparsecheckout true");
        let sparse_checkout_path = git_dir + "/.git/info/sparse-checkout";
        if (dep_name == STD_NAME) {
          import_fs_extra4.default.writeFileSync(sparse_checkout_path, "/crates/sui-framework/packages");
        } else {
          import_fs_extra4.default.writeFileSync(sparse_checkout_path, `${remote_subdir}`);
        }
        import_shelljs.default.exec(`git pull origin ${remote_rev} --depth 1`);
        import_shelljs.default.exec(`git checkout -b ${remote_rev}`);
        if (dep_name != STD_NAME) {
          let relative_std_dir = import_path.default.relative(deps_package_dir, deps_std_dir);
          relative_std_dir = relative_std_dir.replaceAll("\\", "/");
          update_deps_toml(deps_toml_path, `${relative_std_dir}/crates/sui-framework/packages/sui-framework`);
        }
        toml_string = MoveGen.toml_edit_dependencies(toml_string, "dependencies", dep, "local", `./deps/${dep_name}/${remote_subdir}`);
      }
    }
    import_fs_extra4.default.writeFileSync(toml_path, toml_string);
  } catch (e) {
    console.error(e);
  } finally {
    import_shelljs.default.cd(package_path);
  }
  for (var dep in deps_remotes) {
    let dep_p = deps_remotes[dep];
    if (dep_p["network"]) {
      let network = dep_p["network"];
      let module_objectid = dep;
      await clone_chain_move_module(get_move_gen(), network, module_objectid, package_path);
    }
  }
}
function update_deps_toml(deps_toml_path, deps_std) {
  if (import_fs_extra4.default.existsSync(deps_toml_path)) {
    let toml_string = import_fs_extra4.default.readFileSync(deps_toml_path).toString();
    let toml = (0, import_smol_toml.parse)(toml_string);
    let dependencies = toml["dependencies"];
    for (var dep in dependencies) {
      let dep_name = dep.toLowerCase();
      if (dep_name == STD_NAME) {
        dependencies[dep] = {
          local: deps_std
        };
      }
    }
    let result_toml_string = (0, import_smol_toml.stringify)(toml);
    import_fs_extra4.default.writeFileSync(deps_toml_path, result_toml_string);
  }
}

// node_modules/@scure/base/lib/esm/index.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new Error(`${label}: string expected`);
  return true;
}
function anumber(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
  if (!Array.isArray(input))
    throw new Error("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input))
    throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new Error(`${label}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function chain(...args) {
  const id = (a) => a;
  const wrap = (a, b) => (c) => a(b(c));
  const encode = args.map((x) => x.encode).reduceRight(wrap, id);
  const decode = args.map((x) => x.decode).reduce(wrap, id);
  return { encode, decode };
}
// @__NO_SIDE_EFFECTS__
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l, i) => [l, i]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i) => {
        if (!Number.isSafeInteger(i) || i < 0 || i >= len)
          throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
        return lettersA[i];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i = indexes.get(letter);
        if (i === void 0)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i;
      });
    }
  };
}
// @__NO_SIDE_EFFECTS__
function join(separator = "") {
  astr("join", separator);
  return {
    encode: (from) => {
      astrArr("join.decode", from);
      return from.join(separator);
    },
    decode: (to) => {
      astr("join.decode", to);
      return to.split(separator);
    }
  };
}
function convertRadix(data, from, to) {
  if (from < 2)
    throw new Error(`convertRadix: invalid from=${from}, base cannot be less than 2`);
  if (to < 2)
    throw new Error(`convertRadix: invalid to=${to}, base cannot be less than 2`);
  aArr(data);
  if (!data.length)
    return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data, (d) => {
    anumber(d);
    if (d < 0 || d >= from)
      throw new Error(`invalid integer: ${d}`);
    return d;
  });
  const dlen = digits.length;
  while (true) {
    let carry = 0;
    let done = true;
    for (let i = pos; i < dlen; i++) {
      const digit = digits[i];
      const fromCarry = from * carry;
      const digitBase = fromCarry + digit;
      if (!Number.isSafeInteger(digitBase) || fromCarry / from !== carry || digitBase - digit !== fromCarry) {
        throw new Error("convertRadix: carry overflow");
      }
      const div = digitBase / to;
      carry = digitBase % to;
      const rounded = Math.floor(div);
      digits[i] = rounded;
      if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
        throw new Error("convertRadix: carry overflow");
      if (!done)
        continue;
      else if (!rounded)
        pos = i;
      else
        done = false;
    }
    res.push(carry);
    if (done)
      break;
  }
  for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
    res.push(0);
  return res.reverse();
}
// @__NO_SIDE_EFFECTS__
function radix(num) {
  anumber(num);
  const _256 = 2 ** 8;
  return {
    encode: (bytes2) => {
      if (!isBytes(bytes2))
        throw new Error("radix.encode input should be Uint8Array");
      return convertRadix(Array.from(bytes2), _256, num);
    },
    decode: (digits) => {
      anumArr("radix.decode", digits);
      return Uint8Array.from(convertRadix(digits, num, _256));
    }
  };
}
var genBase58 = /* @__NO_SIDE_EFFECTS__ */ (abc) => /* @__PURE__ */ chain(/* @__PURE__ */ radix(58), /* @__PURE__ */ alphabet(abc), /* @__PURE__ */ join(""));
var base58 = /* @__PURE__ */ genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");

// node_modules/@mysten/utils/dist/esm/b58.js
var toBase58 = (buffer) => base58.encode(buffer);
var fromBase58 = (str) => base58.decode(str);

// node_modules/@mysten/utils/dist/esm/b64.js
function fromBase64(base64String) {
  return Uint8Array.from(atob(base64String), (char) => char.charCodeAt(0));
}
var CHUNK_SIZE = 8192;
function toBase64(bytes2) {
  if (bytes2.length < CHUNK_SIZE) {
    return btoa(String.fromCharCode(...bytes2));
  }
  let output = "";
  for (var i = 0; i < bytes2.length; i += CHUNK_SIZE) {
    const chunk = bytes2.slice(i, i + CHUNK_SIZE);
    output += String.fromCharCode(...chunk);
  }
  return btoa(output);
}

// node_modules/@mysten/utils/dist/esm/hex.js
function fromHex(hexStr) {
  const normalized = hexStr.startsWith("0x") ? hexStr.slice(2) : hexStr;
  const padded = normalized.length % 2 === 0 ? normalized : `0${normalized}`;
  const intArr = padded.match(/[0-9a-fA-F]{2}/g)?.map((byte) => parseInt(byte, 16)) ?? [];
  if (intArr.length !== padded.length / 2) {
    throw new Error(`Invalid hex string ${hexStr}`);
  }
  return Uint8Array.from(intArr);
}
function toHex(bytes2) {
  return bytes2.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}

// node_modules/@mysten/bcs/dist/esm/uleb.js
function ulebEncode(num) {
  const arr = [];
  let len = 0;
  if (num === 0) {
    return [0];
  }
  while (num > 0) {
    arr[len] = num & 127;
    if (num >>= 7) {
      arr[len] |= 128;
    }
    len += 1;
  }
  return arr;
}
function ulebDecode(arr) {
  let total = 0;
  let shift = 0;
  let len = 0;
  while (true) {
    const byte = arr[len];
    len += 1;
    total |= (byte & 127) << shift;
    if ((byte & 128) === 0) {
      break;
    }
    shift += 7;
  }
  return {
    value: total,
    length: len
  };
}

// node_modules/@mysten/bcs/dist/esm/reader.js
var BcsReader = class {
  /**
   * @param {Uint8Array} data Data to use as a buffer.
   */
  constructor(data) {
    this.bytePosition = 0;
    this.dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }
  /**
   * Shift current cursor position by `bytes`.
   *
   * @param {Number} bytes Number of bytes to
   * @returns {this} Self for possible chaining.
   */
  shift(bytes2) {
    this.bytePosition += bytes2;
    return this;
  }
  /**
   * Read U8 value from the buffer and shift cursor by 1.
   * @returns
   */
  read8() {
    const value = this.dataView.getUint8(this.bytePosition);
    this.shift(1);
    return value;
  }
  /**
   * Read U16 value from the buffer and shift cursor by 2.
   * @returns
   */
  read16() {
    const value = this.dataView.getUint16(this.bytePosition, true);
    this.shift(2);
    return value;
  }
  /**
   * Read U32 value from the buffer and shift cursor by 4.
   * @returns
   */
  read32() {
    const value = this.dataView.getUint32(this.bytePosition, true);
    this.shift(4);
    return value;
  }
  /**
   * Read U64 value from the buffer and shift cursor by 8.
   * @returns
   */
  read64() {
    const value1 = this.read32();
    const value2 = this.read32();
    const result = value2.toString(16) + value1.toString(16).padStart(8, "0");
    return BigInt("0x" + result).toString(10);
  }
  /**
   * Read U128 value from the buffer and shift cursor by 16.
   */
  read128() {
    const value1 = BigInt(this.read64());
    const value2 = BigInt(this.read64());
    const result = value2.toString(16) + value1.toString(16).padStart(16, "0");
    return BigInt("0x" + result).toString(10);
  }
  /**
   * Read U128 value from the buffer and shift cursor by 32.
   * @returns
   */
  read256() {
    const value1 = BigInt(this.read128());
    const value2 = BigInt(this.read128());
    const result = value2.toString(16) + value1.toString(16).padStart(32, "0");
    return BigInt("0x" + result).toString(10);
  }
  /**
   * Read `num` number of bytes from the buffer and shift cursor by `num`.
   * @param num Number of bytes to read.
   */
  readBytes(num) {
    const start = this.bytePosition + this.dataView.byteOffset;
    const value = new Uint8Array(this.dataView.buffer, start, num);
    this.shift(num);
    return value;
  }
  /**
   * Read ULEB value - an integer of varying size. Used for enum indexes and
   * vector lengths.
   * @returns {Number} The ULEB value.
   */
  readULEB() {
    const start = this.bytePosition + this.dataView.byteOffset;
    const buffer = new Uint8Array(this.dataView.buffer, start);
    const { value, length } = ulebDecode(buffer);
    this.shift(length);
    return value;
  }
  /**
   * Read a BCS vector: read a length and then apply function `cb` X times
   * where X is the length of the vector, defined as ULEB in BCS bytes.
   * @param cb Callback to process elements of vector.
   * @returns {Array<Any>} Array of the resulting values, returned by callback.
   */
  readVec(cb) {
    const length = this.readULEB();
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(cb(this, i, length));
    }
    return result;
  }
};

// node_modules/@mysten/bcs/dist/esm/utils.js
function encodeStr(data, encoding) {
  switch (encoding) {
    case "base58":
      return toBase58(data);
    case "base64":
      return toBase64(data);
    case "hex":
      return toHex(data);
    default:
      throw new Error("Unsupported encoding, supported values are: base64, hex");
  }
}

// node_modules/@mysten/bcs/dist/esm/writer.js
var BcsWriter = class {
  constructor({
    initialSize = 1024,
    maxSize = Infinity,
    allocateSize = 1024
  } = {}) {
    this.bytePosition = 0;
    this.size = initialSize;
    this.maxSize = maxSize;
    this.allocateSize = allocateSize;
    this.dataView = new DataView(new ArrayBuffer(initialSize));
  }
  ensureSizeOrGrow(bytes2) {
    const requiredSize = this.bytePosition + bytes2;
    if (requiredSize > this.size) {
      const nextSize = Math.min(this.maxSize, this.size + this.allocateSize);
      if (requiredSize > nextSize) {
        throw new Error(
          `Attempting to serialize to BCS, but buffer does not have enough size. Allocated size: ${this.size}, Max size: ${this.maxSize}, Required size: ${requiredSize}`
        );
      }
      this.size = nextSize;
      const nextBuffer = new ArrayBuffer(this.size);
      new Uint8Array(nextBuffer).set(new Uint8Array(this.dataView.buffer));
      this.dataView = new DataView(nextBuffer);
    }
  }
  /**
   * Shift current cursor position by `bytes`.
   *
   * @param {Number} bytes Number of bytes to
   * @returns {this} Self for possible chaining.
   */
  shift(bytes2) {
    this.bytePosition += bytes2;
    return this;
  }
  /**
   * Write a U8 value into a buffer and shift cursor position by 1.
   * @param {Number} value Value to write.
   * @returns {this}
   */
  write8(value) {
    this.ensureSizeOrGrow(1);
    this.dataView.setUint8(this.bytePosition, Number(value));
    return this.shift(1);
  }
  /**
   * Write a U16 value into a buffer and shift cursor position by 2.
   * @param {Number} value Value to write.
   * @returns {this}
   */
  write16(value) {
    this.ensureSizeOrGrow(2);
    this.dataView.setUint16(this.bytePosition, Number(value), true);
    return this.shift(2);
  }
  /**
   * Write a U32 value into a buffer and shift cursor position by 4.
   * @param {Number} value Value to write.
   * @returns {this}
   */
  write32(value) {
    this.ensureSizeOrGrow(4);
    this.dataView.setUint32(this.bytePosition, Number(value), true);
    return this.shift(4);
  }
  /**
   * Write a U64 value into a buffer and shift cursor position by 8.
   * @param {bigint} value Value to write.
   * @returns {this}
   */
  write64(value) {
    toLittleEndian(BigInt(value), 8).forEach((el) => this.write8(el));
    return this;
  }
  /**
   * Write a U128 value into a buffer and shift cursor position by 16.
   *
   * @param {bigint} value Value to write.
   * @returns {this}
   */
  write128(value) {
    toLittleEndian(BigInt(value), 16).forEach((el) => this.write8(el));
    return this;
  }
  /**
   * Write a U256 value into a buffer and shift cursor position by 16.
   *
   * @param {bigint} value Value to write.
   * @returns {this}
   */
  write256(value) {
    toLittleEndian(BigInt(value), 32).forEach((el) => this.write8(el));
    return this;
  }
  /**
   * Write a ULEB value into a buffer and shift cursor position by number of bytes
   * written.
   * @param {Number} value Value to write.
   * @returns {this}
   */
  writeULEB(value) {
    ulebEncode(value).forEach((el) => this.write8(el));
    return this;
  }
  /**
   * Write a vector into a buffer by first writing the vector length and then calling
   * a callback on each passed value.
   *
   * @param {Array<Any>} vector Array of elements to write.
   * @param {WriteVecCb} cb Callback to call on each element of the vector.
   * @returns {this}
   */
  writeVec(vector, cb) {
    this.writeULEB(vector.length);
    Array.from(vector).forEach((el, i) => cb(this, el, i, vector.length));
    return this;
  }
  /**
   * Adds support for iterations over the object.
   * @returns {Uint8Array}
   */
  *[Symbol.iterator]() {
    for (let i = 0; i < this.bytePosition; i++) {
      yield this.dataView.getUint8(i);
    }
    return this.toBytes();
  }
  /**
   * Get underlying buffer taking only value bytes (in case initial buffer size was bigger).
   * @returns {Uint8Array} Resulting bcs.
   */
  toBytes() {
    return new Uint8Array(this.dataView.buffer.slice(0, this.bytePosition));
  }
  /**
   * Represent data as 'hex' or 'base64'
   * @param encoding Encoding to use: 'base64' or 'hex'
   */
  toString(encoding) {
    return encodeStr(this.toBytes(), encoding);
  }
};
function toLittleEndian(bigint, size) {
  const result = new Uint8Array(size);
  let i = 0;
  while (bigint > 0) {
    result[i] = Number(bigint % BigInt(256));
    bigint = bigint / BigInt(256);
    i += 1;
  }
  return result;
}

// node_modules/@mysten/bcs/dist/esm/bcs-type.js
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _write;
var _serialize;
var _schema;
var _bytes;
var _BcsType = class _BcsType2 {
  constructor(options) {
    __privateAdd(this, _write);
    __privateAdd(this, _serialize);
    this.name = options.name;
    this.read = options.read;
    this.serializedSize = options.serializedSize ?? (() => null);
    __privateSet(this, _write, options.write);
    __privateSet(this, _serialize, options.serialize ?? ((value, options2) => {
      const writer = new BcsWriter({
        initialSize: this.serializedSize(value) ?? void 0,
        ...options2
      });
      __privateGet(this, _write).call(this, value, writer);
      return writer.toBytes();
    }));
    this.validate = options.validate ?? (() => {
    });
  }
  write(value, writer) {
    this.validate(value);
    __privateGet(this, _write).call(this, value, writer);
  }
  serialize(value, options) {
    this.validate(value);
    return new SerializedBcs(this, __privateGet(this, _serialize).call(this, value, options));
  }
  parse(bytes2) {
    const reader = new BcsReader(bytes2);
    return this.read(reader);
  }
  fromHex(hex) {
    return this.parse(fromHex(hex));
  }
  fromBase58(b64) {
    return this.parse(fromBase58(b64));
  }
  fromBase64(b64) {
    return this.parse(fromBase64(b64));
  }
  transform({
    name,
    input,
    output,
    validate
  }) {
    return new _BcsType2({
      name: name ?? this.name,
      read: (reader) => output ? output(this.read(reader)) : this.read(reader),
      write: (value, writer) => __privateGet(this, _write).call(this, input ? input(value) : value, writer),
      serializedSize: (value) => this.serializedSize(input ? input(value) : value),
      serialize: (value, options) => __privateGet(this, _serialize).call(this, input ? input(value) : value, options),
      validate: (value) => {
        validate?.(value);
        this.validate(input ? input(value) : value);
      }
    });
  }
};
_write = /* @__PURE__ */ new WeakMap();
_serialize = /* @__PURE__ */ new WeakMap();
var BcsType = _BcsType;
var SERIALIZED_BCS_BRAND = Symbol.for("@mysten/serialized-bcs");
var SerializedBcs = class {
  constructor(type, schema) {
    __privateAdd(this, _schema);
    __privateAdd(this, _bytes);
    __privateSet(this, _schema, type);
    __privateSet(this, _bytes, schema);
  }
  // Used to brand SerializedBcs so that they can be identified, even between multiple copies
  // of the @mysten/bcs package are installed
  get [SERIALIZED_BCS_BRAND]() {
    return true;
  }
  toBytes() {
    return __privateGet(this, _bytes);
  }
  toHex() {
    return toHex(__privateGet(this, _bytes));
  }
  toBase64() {
    return toBase64(__privateGet(this, _bytes));
  }
  toBase58() {
    return toBase58(__privateGet(this, _bytes));
  }
  parse() {
    return __privateGet(this, _schema).parse(__privateGet(this, _bytes));
  }
};
_schema = /* @__PURE__ */ new WeakMap();
_bytes = /* @__PURE__ */ new WeakMap();
function fixedSizeBcsType({
  size,
  ...options
}) {
  return new BcsType({
    ...options,
    serializedSize: () => size
  });
}
function uIntBcsType({
  readMethod,
  writeMethod,
  ...options
}) {
  return fixedSizeBcsType({
    ...options,
    read: (reader) => reader[readMethod](),
    write: (value, writer) => writer[writeMethod](value),
    validate: (value) => {
      if (value < 0 || value > options.maxValue) {
        throw new TypeError(
          `Invalid ${options.name} value: ${value}. Expected value in range 0-${options.maxValue}`
        );
      }
      options.validate?.(value);
    }
  });
}
function bigUIntBcsType({
  readMethod,
  writeMethod,
  ...options
}) {
  return fixedSizeBcsType({
    ...options,
    read: (reader) => reader[readMethod](),
    write: (value, writer) => writer[writeMethod](BigInt(value)),
    validate: (val) => {
      const value = BigInt(val);
      if (value < 0 || value > options.maxValue) {
        throw new TypeError(
          `Invalid ${options.name} value: ${value}. Expected value in range 0-${options.maxValue}`
        );
      }
      options.validate?.(value);
    }
  });
}
function dynamicSizeBcsType({
  serialize,
  ...options
}) {
  const type = new BcsType({
    ...options,
    serialize,
    write: (value, writer) => {
      for (const byte of type.serialize(value).toBytes()) {
        writer.write8(byte);
      }
    }
  });
  return type;
}
function stringLikeBcsType({
  toBytes,
  fromBytes,
  ...options
}) {
  return new BcsType({
    ...options,
    read: (reader) => {
      const length = reader.readULEB();
      const bytes2 = reader.readBytes(length);
      return fromBytes(bytes2);
    },
    write: (hex, writer) => {
      const bytes2 = toBytes(hex);
      writer.writeULEB(bytes2.length);
      for (let i = 0; i < bytes2.length; i++) {
        writer.write8(bytes2[i]);
      }
    },
    serialize: (value) => {
      const bytes2 = toBytes(value);
      const size = ulebEncode(bytes2.length);
      const result = new Uint8Array(size.length + bytes2.length);
      result.set(size, 0);
      result.set(bytes2, size.length);
      return result;
    },
    validate: (value) => {
      if (typeof value !== "string") {
        throw new TypeError(`Invalid ${options.name} value: ${value}. Expected string`);
      }
      options.validate?.(value);
    }
  });
}
function lazyBcsType(cb) {
  let lazyType = null;
  function getType() {
    if (!lazyType) {
      lazyType = cb();
    }
    return lazyType;
  }
  return new BcsType({
    name: "lazy",
    read: (data) => getType().read(data),
    serializedSize: (value) => getType().serializedSize(value),
    write: (value, writer) => getType().write(value, writer),
    serialize: (value, options) => getType().serialize(value, options).toBytes()
  });
}

// node_modules/@mysten/bcs/dist/esm/bcs.js
var bcs = {
  /**
   * Creates a BcsType that can be used to read and write an 8-bit unsigned integer.
   * @example
   * bcs.u8().serialize(255).toBytes() // Uint8Array [ 255 ]
   */
  u8(options) {
    return uIntBcsType({
      name: "u8",
      readMethod: "read8",
      writeMethod: "write8",
      size: 1,
      maxValue: 2 ** 8 - 1,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 16-bit unsigned integer.
   * @example
   * bcs.u16().serialize(65535).toBytes() // Uint8Array [ 255, 255 ]
   */
  u16(options) {
    return uIntBcsType({
      name: "u16",
      readMethod: "read16",
      writeMethod: "write16",
      size: 2,
      maxValue: 2 ** 16 - 1,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 32-bit unsigned integer.
   * @example
   * bcs.u32().serialize(4294967295).toBytes() // Uint8Array [ 255, 255, 255, 255 ]
   */
  u32(options) {
    return uIntBcsType({
      name: "u32",
      readMethod: "read32",
      writeMethod: "write32",
      size: 4,
      maxValue: 2 ** 32 - 1,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 64-bit unsigned integer.
   * @example
   * bcs.u64().serialize(1).toBytes() // Uint8Array [ 1, 0, 0, 0, 0, 0, 0, 0 ]
   */
  u64(options) {
    return bigUIntBcsType({
      name: "u64",
      readMethod: "read64",
      writeMethod: "write64",
      size: 8,
      maxValue: 2n ** 64n - 1n,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 128-bit unsigned integer.
   * @example
   * bcs.u128().serialize(1).toBytes() // Uint8Array [ 1, ..., 0 ]
   */
  u128(options) {
    return bigUIntBcsType({
      name: "u128",
      readMethod: "read128",
      writeMethod: "write128",
      size: 16,
      maxValue: 2n ** 128n - 1n,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write a 256-bit unsigned integer.
   * @example
   * bcs.u256().serialize(1).toBytes() // Uint8Array [ 1, ..., 0 ]
   */
  u256(options) {
    return bigUIntBcsType({
      name: "u256",
      readMethod: "read256",
      writeMethod: "write256",
      size: 32,
      maxValue: 2n ** 256n - 1n,
      ...options
    });
  },
  /**
   * Creates a BcsType that can be used to read and write boolean values.
   * @example
   * bcs.bool().serialize(true).toBytes() // Uint8Array [ 1 ]
   */
  bool(options) {
    return fixedSizeBcsType({
      name: "bool",
      size: 1,
      read: (reader) => reader.read8() === 1,
      write: (value, writer) => writer.write8(value ? 1 : 0),
      ...options,
      validate: (value) => {
        options?.validate?.(value);
        if (typeof value !== "boolean") {
          throw new TypeError(`Expected boolean, found ${typeof value}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType that can be used to read and write unsigned LEB encoded integers
   * @example
   *
   */
  uleb128(options) {
    return dynamicSizeBcsType({
      name: "uleb128",
      read: (reader) => reader.readULEB(),
      serialize: (value) => {
        return Uint8Array.from(ulebEncode(value));
      },
      ...options
    });
  },
  /**
   * Creates a BcsType representing a fixed length byte array
   * @param size The number of bytes this types represents
   * @example
   * bcs.bytes(3).serialize(new Uint8Array([1, 2, 3])).toBytes() // Uint8Array [1, 2, 3]
   */
  bytes(size, options) {
    return fixedSizeBcsType({
      name: `bytes[${size}]`,
      size,
      read: (reader) => reader.readBytes(size),
      write: (value, writer) => {
        const array = new Uint8Array(value);
        for (let i = 0; i < size; i++) {
          writer.write8(array[i] ?? 0);
        }
      },
      ...options,
      validate: (value) => {
        options?.validate?.(value);
        if (!value || typeof value !== "object" || !("length" in value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
        if (value.length !== size) {
          throw new TypeError(`Expected array of length ${size}, found ${value.length}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing a variable length byte array
   *
   * @example
   * bcs.byteVector().serialize([1, 2, 3]).toBytes() // Uint8Array [3, 1, 2, 3]
   */
  byteVector(options) {
    return new BcsType({
      name: `bytesVector`,
      read: (reader) => {
        const length = reader.readULEB();
        return reader.readBytes(length);
      },
      write: (value, writer) => {
        const array = new Uint8Array(value);
        writer.writeULEB(array.length);
        for (let i = 0; i < array.length; i++) {
          writer.write8(array[i] ?? 0);
        }
      },
      ...options,
      serializedSize: (value) => {
        const length = "length" in value ? value.length : null;
        return length == null ? null : ulebEncode(length).length + length;
      },
      validate: (value) => {
        options?.validate?.(value);
        if (!value || typeof value !== "object" || !("length" in value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType that can ser/de string values.  Strings will be UTF-8 encoded
   * @example
   * bcs.string().serialize('a').toBytes() // Uint8Array [ 1, 97 ]
   */
  string(options) {
    return stringLikeBcsType({
      name: "string",
      toBytes: (value) => new TextEncoder().encode(value),
      fromBytes: (bytes2) => new TextDecoder().decode(bytes2),
      ...options
    });
  },
  /**
   * Creates a BcsType that represents a fixed length array of a given type
   * @param size The number of elements in the array
   * @param type The BcsType of each element in the array
   * @example
   * bcs.fixedArray(3, bcs.u8()).serialize([1, 2, 3]).toBytes() // Uint8Array [ 1, 2, 3 ]
   */
  fixedArray(size, type, options) {
    return new BcsType({
      name: `${type.name}[${size}]`,
      read: (reader) => {
        const result = new Array(size);
        for (let i = 0; i < size; i++) {
          result[i] = type.read(reader);
        }
        return result;
      },
      write: (value, writer) => {
        for (const item of value) {
          type.write(item, writer);
        }
      },
      ...options,
      validate: (value) => {
        options?.validate?.(value);
        if (!value || typeof value !== "object" || !("length" in value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
        if (value.length !== size) {
          throw new TypeError(`Expected array of length ${size}, found ${value.length}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing an optional value
   * @param type The BcsType of the optional value
   * @example
   * bcs.option(bcs.u8()).serialize(null).toBytes() // Uint8Array [ 0 ]
   * bcs.option(bcs.u8()).serialize(1).toBytes() // Uint8Array [ 1, 1 ]
   */
  option(type) {
    return bcs.enum(`Option<${type.name}>`, {
      None: null,
      Some: type
    }).transform({
      input: (value) => {
        if (value == null) {
          return { None: true };
        }
        return { Some: value };
      },
      output: (value) => {
        if (value.$kind === "Some") {
          return value.Some;
        }
        return null;
      }
    });
  },
  /**
   * Creates a BcsType representing a variable length vector of a given type
   * @param type The BcsType of each element in the vector
   *
   * @example
   * bcs.vector(bcs.u8()).toBytes([1, 2, 3]) // Uint8Array [ 3, 1, 2, 3 ]
   */
  vector(type, options) {
    return new BcsType({
      name: `vector<${type.name}>`,
      read: (reader) => {
        const length = reader.readULEB();
        const result = new Array(length);
        for (let i = 0; i < length; i++) {
          result[i] = type.read(reader);
        }
        return result;
      },
      write: (value, writer) => {
        writer.writeULEB(value.length);
        for (const item of value) {
          type.write(item, writer);
        }
      },
      ...options,
      validate: (value) => {
        options?.validate?.(value);
        if (!value || typeof value !== "object" || !("length" in value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing a tuple of a given set of types
   * @param types The BcsTypes for each element in the tuple
   *
   * @example
   * const tuple = bcs.tuple([bcs.u8(), bcs.string(), bcs.bool()])
   * tuple.serialize([1, 'a', true]).toBytes() // Uint8Array [ 1, 1, 97, 1 ]
   */
  tuple(types, options) {
    return new BcsType({
      name: `(${types.map((t) => t.name).join(", ")})`,
      serializedSize: (values) => {
        let total = 0;
        for (let i = 0; i < types.length; i++) {
          const size = types[i].serializedSize(values[i]);
          if (size == null) {
            return null;
          }
          total += size;
        }
        return total;
      },
      read: (reader) => {
        const result = [];
        for (const type of types) {
          result.push(type.read(reader));
        }
        return result;
      },
      write: (value, writer) => {
        for (let i = 0; i < types.length; i++) {
          types[i].write(value[i], writer);
        }
      },
      ...options,
      validate: (value) => {
        options?.validate?.(value);
        if (!Array.isArray(value)) {
          throw new TypeError(`Expected array, found ${typeof value}`);
        }
        if (value.length !== types.length) {
          throw new TypeError(`Expected array of length ${types.length}, found ${value.length}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing a struct of a given set of fields
   * @param name The name of the struct
   * @param fields The fields of the struct. The order of the fields affects how data is serialized and deserialized
   *
   * @example
   * const struct = bcs.struct('MyStruct', {
   *  a: bcs.u8(),
   *  b: bcs.string(),
   * })
   * struct.serialize({ a: 1, b: 'a' }).toBytes() // Uint8Array [ 1, 1, 97 ]
   */
  struct(name, fields, options) {
    const canonicalOrder = Object.entries(fields);
    return new BcsType({
      name,
      serializedSize: (values) => {
        let total = 0;
        for (const [field, type] of canonicalOrder) {
          const size = type.serializedSize(values[field]);
          if (size == null) {
            return null;
          }
          total += size;
        }
        return total;
      },
      read: (reader) => {
        const result = {};
        for (const [field, type] of canonicalOrder) {
          result[field] = type.read(reader);
        }
        return result;
      },
      write: (value, writer) => {
        for (const [field, type] of canonicalOrder) {
          type.write(value[field], writer);
        }
      },
      ...options,
      validate: (value) => {
        options?.validate?.(value);
        if (typeof value !== "object" || value == null) {
          throw new TypeError(`Expected object, found ${typeof value}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing an enum of a given set of options
   * @param name The name of the enum
   * @param values The values of the enum. The order of the values affects how data is serialized and deserialized.
   * null can be used to represent a variant with no data.
   *
   * @example
   * const enum = bcs.enum('MyEnum', {
   *   A: bcs.u8(),
   *   B: bcs.string(),
   *   C: null,
   * })
   * enum.serialize({ A: 1 }).toBytes() // Uint8Array [ 0, 1 ]
   * enum.serialize({ B: 'a' }).toBytes() // Uint8Array [ 1, 1, 97 ]
   * enum.serialize({ C: true }).toBytes() // Uint8Array [ 2 ]
   */
  enum(name, values, options) {
    const canonicalOrder = Object.entries(values);
    return new BcsType({
      name,
      read: (reader) => {
        const index = reader.readULEB();
        const enumEntry = canonicalOrder[index];
        if (!enumEntry) {
          throw new TypeError(`Unknown value ${index} for enum ${name}`);
        }
        const [kind, type] = enumEntry;
        return {
          [kind]: type?.read(reader) ?? true,
          $kind: kind
        };
      },
      write: (value, writer) => {
        const [name2, val] = Object.entries(value).filter(
          ([name3]) => Object.hasOwn(values, name3)
        )[0];
        for (let i = 0; i < canonicalOrder.length; i++) {
          const [optionName, optionType] = canonicalOrder[i];
          if (optionName === name2) {
            writer.writeULEB(i);
            optionType?.write(val, writer);
            return;
          }
        }
      },
      ...options,
      validate: (value) => {
        options?.validate?.(value);
        if (typeof value !== "object" || value == null) {
          throw new TypeError(`Expected object, found ${typeof value}`);
        }
        const keys = Object.keys(value).filter(
          (k) => value[k] !== void 0 && Object.hasOwn(values, k)
        );
        if (keys.length !== 1) {
          throw new TypeError(
            `Expected object with one key, but found ${keys.length} for type ${name}}`
          );
        }
        const [variant] = keys;
        if (!Object.hasOwn(values, variant)) {
          throw new TypeError(`Invalid enum variant ${variant}`);
        }
      }
    });
  },
  /**
   * Creates a BcsType representing a map of a given key and value type
   * @param keyType The BcsType of the key
   * @param valueType The BcsType of the value
   * @example
   * const map = bcs.map(bcs.u8(), bcs.string())
   * map.serialize(new Map([[2, 'a']])).toBytes() // Uint8Array [ 1, 2, 1, 97 ]
   */
  map(keyType, valueType) {
    return bcs.vector(bcs.tuple([keyType, valueType])).transform({
      name: `Map<${keyType.name}, ${valueType.name}>`,
      input: (value) => {
        return [...value.entries()];
      },
      output: (value) => {
        const result = /* @__PURE__ */ new Map();
        for (const [key, val] of value) {
          result.set(key, val);
        }
        return result;
      }
    });
  },
  /**
   * Creates a BcsType that wraps another BcsType which is lazily evaluated. This is useful for creating recursive types.
   * @param cb A callback that returns the BcsType
   */
  lazy(cb) {
    return lazyBcsType(cb);
  }
};

// src/sui/util.ts
function hexToNumArray(x) {
  return Array.from(fromHex(x));
}
function has_value(v) {
  if (Array.isArray(v)) {
    return v.length > 0;
  } else {
    return v ? true : false;
  }
}
function has_arr(v) {
  let flat_arr = v.flat(Infinity);
  return flat_arr.length > 0;
}
function to_arr_value(v) {
  if (Array.isArray(v)) {
    let flat_arr = v.flat(Infinity);
    for (var i = 0; i < flat_arr.length; i++) {
      if (typeof flat_arr != "undefined") return flat_arr[i];
    }
  } else {
    return v;
  }
}
function copy_arr_value(from_arr, to_arr) {
  if (from_arr && to_arr && Array.isArray(from_arr) && Array.isArray(to_arr)) {
    for (var i = 0; i < from_arr.length; i++) {
      to_arr[i] = from_arr[i];
    }
  }
}
function into_arr_value(arr, dep = Infinity) {
  let newArr = [];
  arr.forEach((ele) => {
    if (Array.isArray(ele) && dep > 0) {
      newArr.push(into_arr_value(ele, dep - 1));
    } else {
      newArr.push(ele.into_value ? ele.into_value() : ele);
    }
  });
  return newArr;
}
function get_arr_deps(arr) {
  if (!Array.isArray(arr)) {
    return 0;
  }
  let depth = 1;
  for (let i = 0; i < arr.length; i++) {
    const cur = arr[i];
    if (Array.isArray(cur)) {
      const curDepth = get_arr_deps(cur) + 1;
      depth = Math.max(depth, curDepth);
    }
  }
  return depth;
}
function get_arr_bcs_vector(val, deps) {
  if (deps > 0) {
    return bcs.vector(get_arr_bcs_vector(val, deps - 1));
  } else {
    return val.serialize_bcs();
  }
}
function into_arr_bcs_vector(arr) {
  let deps = get_arr_deps(arr);
  let val = to_arr_value(arr);
  return get_arr_bcs_vector(val, deps);
}

// src/sui/types.ts
function isTransactionArgument(arg) {
  if (!arg || typeof arg !== "object" || Array.isArray(arg)) {
    return false;
  }
  return "GasCoin" in arg || "Input" in arg || "Result" in arg || "NestedResult" in arg;
}
var Address = class _Address {
  constructor(value) {
    this.$type = "address";
    this.value = value;
  }
  static $type() {
    return "address";
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.bytes(32).transform({
      // To change the input type, you need to provide a type definition for the input
      input: (val) => fromHex(val.into_value()),
      output: (val) => new _Address(toHex(val))
    });
  }
  get_bcs() {
    return _Address.bcs;
  }
  get_value() {
    return this.value;
  }
};
var Boolean = class _Boolean {
  constructor(value) {
    this.$type = "bool";
    this.value = value;
  }
  static $type() {
    return "bool";
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.bool().transform({
      input: (val) => val,
      output: (val) => new _Boolean(val)
    });
  }
  get_bcs() {
    return _Boolean.bcs;
  }
  get_value() {
    return this.value;
  }
};
var Ascii = class _Ascii {
  constructor(value) {
    this.$type = "0x1::ascii::String";
    this.value = value;
  }
  static $type() {
    return "0x1::ascii::String";
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.string().transform({
      input: (val) => val,
      output: (val) => new _Ascii(val)
    });
  }
  get_bcs() {
    return _Ascii.bcs;
  }
  get_value() {
    return this.value;
  }
};
var String2 = class _String {
  constructor(value) {
    this.$type = "0x1::string::String";
    this.value = value;
  }
  static $type() {
    return "0x1::string::String";
  }
  into_uint8array() {
    return new TextEncoder().encode(this.value);
  }
  into_u8array() {
    let uint8 = new TextEncoder().encode(this.value);
    let r = [];
    for (var i = 0; i < uint8.length; i++) {
      r.push(new U8(uint8[i]));
    }
    return r;
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.string().transform({
      input: (val) => val,
      output: (val) => new _String(val)
    });
  }
  get_bcs() {
    return _String.bcs;
  }
  get_value() {
    return this.value;
  }
};
var U8 = class _U8 {
  constructor(value) {
    this.$type = "u8";
    this.value = value;
  }
  static $type() {
    return "u8";
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.u8().transform({
      input: (val) => val,
      output: (val) => new _U8(val)
    });
  }
  get_bcs() {
    return _U8.bcs;
  }
  get_value() {
    return this.value;
  }
};
var U16 = class _U16 {
  constructor(value) {
    this.$type = "u16";
    this.value = value;
  }
  static $type() {
    return "u16";
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.u16().transform({
      input: (val) => val,
      output: (val) => new _U16(val)
    });
  }
  get_bcs() {
    return _U16.bcs;
  }
  get_value() {
    return this.value;
  }
};
var U32 = class _U32 {
  constructor(value) {
    this.$type = "u32";
    this.value = value;
  }
  static $type() {
    return "u32";
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.u32().transform({
      input: (val) => val,
      output: (val) => new _U32(val)
    });
  }
  get_bcs() {
    return _U32.bcs;
  }
  get_value() {
    return this.value;
  }
};
var U64 = class _U64 {
  constructor(value) {
    this.$type = "u64";
    this.value = value;
  }
  static $type() {
    return "u64";
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.u64().transform({
      input: (val) => val,
      output: (val) => {
        if (!isNaN(Number(val))) {
          return new _U64(Number(val));
        }
        return new _U64(val);
      }
    });
  }
  get_bcs() {
    return _U64.bcs;
  }
  get_value() {
    return this.value;
  }
  static v1_bcs(v) {
    return v[0];
  }
  static v2_bcs(v) {
    return v[0][0];
  }
};
var U128 = class _U128 {
  constructor(value) {
    this.$type = "u128";
    this.value = value;
  }
  static $type() {
    return "u128";
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.u128().transform({
      input: (val) => val,
      output: (val) => {
        if (!isNaN(Number(val))) {
          return new _U128(Number(val));
        }
        return new _U128(val);
      }
    });
  }
  get_bcs() {
    return _U128.bcs;
  }
  get_value() {
    return this.value;
  }
};
var U256 = class _U256 {
  constructor(value) {
    this.$type = "u256";
    this.value = value;
  }
  static $type() {
    return "u256";
  }
  from(v) {
    this.value = v.value;
  }
  serialize_bcs() {
    return this.get_bcs();
  }
  return_bcs() {
    return this.get_bcs();
  }
  into_value() {
    return this.value;
  }
  from_bcs_t(bytes2) {
    return this.from_bcs(this.get_bcs().parse(bytes2));
  }
  from_bcs_vector_t(bytes2) {
    return this.from_bcs_vector(bcs.vector(this.get_bcs()).parse(bytes2));
  }
  serialize(arg) {
    return this.get_bcs().serialize(arg);
  }
  from_bcs(arg) {
    return arg;
  }
  from_bcs_vector(args) {
    return args;
  }
  static get bcs() {
    return bcs.u256().transform({
      input: (val) => val,
      output: (val) => {
        if (!isNaN(Number(val))) {
          return new _U256(Number(val));
        }
        return new _U256(val);
      }
    });
  }
  get_bcs() {
    return _U256.bcs;
  }
  get_value() {
    return this.value;
  }
};

// src/sui/clone.ts
var import_client = require("@mysten/sui/client");
var import_smol_toml2 = require("smol-toml");
var import_fs_extra5 = __toESM(require("fs-extra"));
async function clone_chain_move_module(move_gen2, network, module_objectid, package_path) {
  let out = package_path + "/deps";
  if (!import_fs_extra5.default.existsSync(out)) {
    import_fs_extra5.default.mkdirpSync(out);
  }
  if (!import_fs_extra5.default.existsSync(out)) {
    import_fs_extra5.default.mkdirpSync(out);
  }
  let fullNodeUrl = (0, import_client.getFullnodeUrl)(network);
  let result_ids = [];
  console.log(`Download move bytecodes of ${module_objectid} from ${fullNodeUrl}`);
  await get_online_packages(network, module_objectid, result_ids, package_path);
  const suiClient = new import_client.SuiClient({ url: fullNodeUrl });
  let results = await suiClient.multiGetObjects({
    ids: result_ids,
    options: {
      showBcs: true,
      showContent: true,
      showDisplay: true
    }
  });
  if (results) {
    for (var i = 0; i < results.length; i++) {
      let r = results[i];
      if (r.data) {
        let bcs2 = r.data.bcs;
        let objectid = r.data.objectId;
        let moduleMap = bcs2.moduleMap;
        for (var module_name in moduleMap) {
          let module_base64 = moduleMap[module_name];
          move_gen2.run_module_gen(out, objectid, new Uint8Array(fromBase64(module_base64)));
        }
        console.log(`Disassemble move bytecodes of ${objectid} into move interfaces`);
        let out_bcs = out + "/" + module_objectid + "/bcs";
        if (!import_fs_extra5.default.existsSync(out_bcs)) {
          import_fs_extra5.default.mkdirpSync(out_bcs);
        }
        let out_bcs_file = `${out_bcs}/${objectid}.json`;
        import_fs_extra5.default.writeFileSync(out_bcs_file, JSON.stringify(moduleMap, null, 2));
      }
    }
    let toml_path = package_path + "/Move.toml";
    let toml_string = import_fs_extra5.default.readFileSync(toml_path).toString();
    toml_string = MoveGen.toml_edit_dependencies(toml_string, "dependencies-remote", module_objectid, "network", network);
    toml_string = MoveGen.toml_edit_dependencies(toml_string, "dependencies", module_objectid, "local", `./deps/${module_objectid}`);
    console.log(`Update Move.toml [dependencies-remote] and [dependencies] of ${module_objectid}`);
    import_fs_extra5.default.writeFileSync(toml_path, toml_string);
    console.log(`Clone move bytecodes of ${module_objectid} done!`);
  }
}
async function get_online_packages(network, objectid, result_ids, package_path) {
  let out = package_path + "/deps";
  const suiClient = new import_client.SuiClient({ url: (0, import_client.getFullnodeUrl)(network) });
  let result = await suiClient.getObject({
    id: objectid,
    options: {
      showBcs: true
    }
  });
  if (result_ids.indexOf(objectid) == -1) {
    result_ids.push(objectid);
  }
  if (result && result.data?.bcs) {
    let bcs2 = result.data.bcs;
    let linkageTable = bcs2.linkageTable;
    let deps_modules = [];
    for (var package_id in linkageTable) {
      let upgraded_id = linkageTable[package_id].upgraded_id;
      if (upgraded_id == "0x0000000000000000000000000000000000000000000000000000000000000001") continue;
      if (upgraded_id == "0x0000000000000000000000000000000000000000000000000000000000000002") continue;
      if (deps_modules.indexOf(upgraded_id) == -1) {
        deps_modules.push(upgraded_id);
      }
      if (result_ids.indexOf(upgraded_id) == -1) {
        result_ids.push(upgraded_id);
        await get_online_packages(network, upgraded_id, result_ids, package_path);
      }
    }
    if (import_fs_extra5.default.existsSync(out)) {
      gen_move_toml(deps_modules, out, objectid);
    }
  }
}
function gen_move_toml(deps_modules, out, objectId) {
  let out_dir = out + "/" + objectId;
  if (!import_fs_extra5.default.existsSync(out_dir)) {
    import_fs_extra5.default.mkdirpSync(out_dir);
  }
  let move_toml = out_dir + "/Move.toml";
  let dependencies = {};
  dependencies["Sui"] = {
    local: `../sui/crates/sui-framework/packages/sui-framework`
  };
  for (var i = 0; i < deps_modules.length; i++) {
    if (deps_modules[i] == "0x0000000000000000000000000000000000000000000000000000000000000001") continue;
    if (deps_modules[i] == "0x0000000000000000000000000000000000000000000000000000000000000002") continue;
    let local_name = deps_modules[i];
    let local_path = "../" + deps_modules[i];
    dependencies[local_name] = {
      local: local_path
    };
  }
  let contents = {
    package: {
      name: objectId,
      "published-at": objectId
    },
    dependencies,
    addresses: {
      std: "0x1",
      sui: "0x2"
    },
    "dev-dependencies": {},
    "dev-addresses": {}
  };
  let move_toml_result = (0, import_smol_toml2.stringify)(contents);
  import_fs_extra5.default.writeFileSync(move_toml, move_toml_result);
}

// src/sui/debug.ts
var import_smol_toml3 = require("smol-toml");
var import_fs_extra6 = __toESM(require("fs-extra"));
function debug_move_function(wasm_runtime, code_helper, package_path, module_name, func_name) {
  let toml_path = package_path + "/Move.toml";
  if (!import_fs_extra6.default.existsSync(toml_path)) {
    console.error(`Unable to find package manifest at ${package_path}`);
    return;
  }
  setup_move(code_helper, package_path, true);
  let funcs2 = code_helper.get_functions(module_name);
  let func_names = JSON.parse(funcs2);
  if (!func_names.length) {
    console.error(`Unable to find module: ${module_name}`);
    return;
  }
  if (func_names.indexOf(func_name) == -1) {
    console.error(`Unable to find function: ${func_name} in module: ${module_name}`);
    return;
  }
  let toml_string = import_fs_extra6.default.readFileSync(toml_path).toString();
  let toml = (0, import_smol_toml3.parse)(toml_string);
  let package_name = toml.package.name;
  let package_address = toml.addresses[package_name];
  setup(wasm_runtime, package_path);
  let trace_dir = package_path + "/traces";
  let trace_file = `${package_path}/traces/${package_name}__${module_name}__${func_name}.json`;
  import_fs_extra6.default.removeSync(trace_dir);
  import_fs_extra6.default.mkdirpSync(trace_dir);
  wasm_runtime.set_tracer_enable(true, trace_file);
  wasm_runtime.call_return_bcs(package_address, module_name, func_name, [], []);
}

// src/sui/setup.ts
var import_read_dir_deep = require("read-dir-deep");
var import_smol_toml4 = require("smol-toml");
var import_fs_extra7 = __toESM(require("fs-extra"));
function setup(runtime, package_path) {
  let toml_path = package_path + "/Move.toml";
  let toml_string = import_fs_extra7.default.readFileSync(toml_path).toString();
  let toml = (0, import_smol_toml4.parse)(toml_string);
  let package_name = toml.package.name;
  for (var dep_module in toml.dependencies) {
    if (dep_module.startsWith("0x") && toml.dependencies[dep_module]["local"]) {
      let local_bcs_path = toml.dependencies[dep_module]["local"] + "/bcs";
      if (import_fs_extra7.default.existsSync(local_bcs_path)) {
        let bcs_json_files = import_fs_extra7.default.readdirSync(local_bcs_path);
        for (var i = 0; i < bcs_json_files.length; i++) {
          let bcs_json_file = local_bcs_path + "/" + bcs_json_files[i];
          var bcs_json_data = import_fs_extra7.default.readFileSync(bcs_json_file).toString();
          if (bcs_json_data) {
            var bcs_json = JSON.parse(bcs_json_data);
            for (var bcs_module in bcs_json) {
              runtime.publish_module(fromBase64(bcs_json[bcs_module]));
            }
          }
        }
      }
    }
  }
  let bytecode_path = package_path + `/build/${package_name}/bytecode_modules`;
  let files = (0, import_read_dir_deep.readDirDeepSync)(bytecode_path, { gitignore: false, ignore: [] });
  for (var i = 0; i < files.length; i++) {
    if (files[i].indexOf("dependencies/0x") != -1) {
      continue;
    }
    let bytes2 = import_fs_extra7.default.readFileSync(files[i]);
    let unit8_bytes = new Uint8Array(bytes2);
    runtime.publish_module(unit8_bytes);
  }
  let sourec_map_path = package_path + `/build/${package_name}/source_maps`;
  if (!import_fs_extra7.default.existsSync(sourec_map_path)) {
    sourec_map_path = package_path + `/build/${package_name}/debug_info`;
  }
  files = (0, import_read_dir_deep.readDirDeepSync)(sourec_map_path, { gitignore: false, ignore: [] });
  for (var i = 0; i < files.length; i++) {
    if (files[i].indexOf(".json") == -1) {
      continue;
    }
    let bytes2 = import_fs_extra7.default.readFileSync(files[i]).toString();
    runtime.add_source_map_json(bytes2);
  }
  let sourec_codes_path = package_path + `/build/${package_name}/sources`;
  files = (0, import_read_dir_deep.readDirDeepSync)(sourec_codes_path, { gitignore: false, ignore: [] });
  for (var i = 0; i < files.length; i++) {
    if (files[i].indexOf(".move") == -1) {
      continue;
    }
    let bytes2 = import_fs_extra7.default.readFileSync(files[i]).toString();
    runtime.add_source_code(bytes2);
  }
  runtime.setup_storage();
}
function setup_move(runtime, package_path, include_deps) {
  let toml_path = package_path + "/Move.toml";
  let toml_string = import_fs_extra7.default.readFileSync(toml_path).toString();
  let toml = (0, import_smol_toml4.parse)(toml_string);
  let package_name = toml.package.name;
  if (include_deps) {
    for (var dep_module in toml.dependencies) {
      if (dep_module.startsWith("0x") && toml.dependencies[dep_module]["local"]) {
        let local_bcs_path = toml.dependencies[dep_module]["local"] + "/bcs";
        if (import_fs_extra7.default.existsSync(local_bcs_path)) {
          let bcs_json_files = import_fs_extra7.default.readdirSync(local_bcs_path);
          for (var i = 0; i < bcs_json_files.length; i++) {
            let bcs_json_file = local_bcs_path + "/" + bcs_json_files[i];
            let bcs_json_module = bcs_json_files[i].substring(0, bcs_json_files[i].indexOf(".json"));
            var bcs_json_data = import_fs_extra7.default.readFileSync(bcs_json_file).toString();
            if (bcs_json_data) {
              var bcs_json = JSON.parse(bcs_json_data);
              for (var bcs_module in bcs_json) {
                runtime.register_module(bcs_json_module, fromBase64(bcs_json[bcs_module]));
              }
            }
          }
        }
      }
    }
  }
  let bytecode_path = package_path + `/build/${package_name}/bytecode_modules`;
  let files = [];
  if (include_deps) {
    files = (0, import_read_dir_deep.readDirDeepSync)(bytecode_path, { gitignore: false, ignore: [] });
  } else {
    var dirfiles = import_fs_extra7.default.readdirSync(bytecode_path);
    files = dirfiles.map(function(f) {
      return bytecode_path + "/" + f;
    });
  }
  for (var i = 0; i < files.length; i++) {
    let file = files[i];
    let regex = /\/dependencies\/(.*?)\/.*?.mv/;
    let match = file.match(regex);
    if (match) {
      match = match[1];
    } else {
      match = package_name;
    }
    if (file.indexOf("dependencies/0x") != -1) {
      continue;
    }
    if (file.indexOf(".mv") == -1) {
      continue;
    }
    var bytes2 = import_fs_extra7.default.readFileSync(file);
    runtime.register_module(match, new Uint8Array(bytes2));
  }
  runtime.build_bytecode_model();
}
function setup_move_gen(package_path, include_deps) {
  setup_move(get_move_gen(), package_path, include_deps);
}
function setup_move_code_helper(package_path, include_deps) {
  setup_move(get_move_code_helper(), package_path, include_deps);
}

// src/sui/publish.ts
var import_client2 = require("@mysten/sui/client");
var import_transactions = require("@mysten/sui/transactions");
var import_cryptography = require("@mysten/sui/cryptography");
var import_ed25519 = require("@mysten/sui/keypairs/ed25519");
var import_shelljs2 = __toESM(require("shelljs"));
var import_fs_extra8 = __toESM(require("fs-extra"));
async function upgrade_move_module(sui_bin_path, package_path, network, old_package_id, upgrade_cap_id) {
  import_shelljs2.default.cd(package_path);
  let move_lock = package_path + "/Move.lock";
  import_fs_extra8.default.removeSync(move_lock);
  let buildCommandOutput = import_shelljs2.default.exec(`${sui_bin_path} move build --dump-bytecode-as-base64`).stdout;
  const { modules, dependencies, digest } = JSON.parse(buildCommandOutput);
  const client = new import_client2.SuiClient({ url: (0, import_client2.getFullnodeUrl)(network) });
  const tx = new import_transactions.Transaction();
  const pair = (0, import_cryptography.decodeSuiPrivateKey)(process.env.SUI_PRIVATE_KEY || "");
  const keypair = import_ed25519.Ed25519Keypair.fromSecretKey(pair.secretKey);
  let publish_to = keypair.getPublicKey().toSuiAddress();
  const ticket = tx.moveCall({
    target: `0x2::package::authorize_upgrade`,
    arguments: [
      tx.object(upgrade_cap_id),
      tx.pure.u8(import_transactions.UpgradePolicy.COMPATIBLE),
      tx.pure(bcs.byteVector().serialize(new Uint8Array(digest)).toBytes())
    ]
  });
  const receipt = tx.upgrade({
    modules,
    dependencies,
    package: old_package_id,
    ticket
  });
  tx.moveCall({
    target: `0x2::package::commit_upgrade`,
    arguments: [tx.object(upgrade_cap_id), receipt]
  });
  tx.setSender(publish_to);
  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair
  });
  const publishTxn = await client.waitForTransaction({
    digest: result.digest,
    options: {
      showEffects: true,
      showObjectChanges: true
    }
  });
  return parsePublishTxn(publishTxn);
}
async function publish_move_module(sui_bin_path, package_path, network) {
  import_shelljs2.default.cd(package_path);
  let move_lock = package_path + "/Move.lock";
  import_fs_extra8.default.removeSync(move_lock);
  let buildCommandOutput = import_shelljs2.default.exec(`${sui_bin_path} move build --dump-bytecode-as-base64`).stdout;
  const { modules, dependencies } = JSON.parse(buildCommandOutput);
  return await publish(network, modules, dependencies);
}
async function publish(network, modules, dependencies) {
  const client = new import_client2.SuiClient({ url: (0, import_client2.getFullnodeUrl)(network) });
  const tx = new import_transactions.Transaction();
  const pair = (0, import_cryptography.decodeSuiPrivateKey)(process.env.SUI_PRIVATE_KEY || "");
  const keypair = import_ed25519.Ed25519Keypair.fromSecretKey(pair.secretKey);
  let publish_to = keypair.getPublicKey().toSuiAddress();
  const upgradeCap = tx.publish({ modules, dependencies });
  tx.transferObjects([upgradeCap], tx.pure.address(publish_to));
  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair
  });
  const publishTxn = await client.waitForTransaction({
    digest: result.digest,
    options: {
      showEffects: true,
      showObjectChanges: true
    }
  });
  return parsePublishTxn(publishTxn);
}
var parsePublishTxn = ({ objectChanges, digest }) => {
  if (!objectChanges) throw new Error("objectChanges is null or undefined");
  const parseRes = {
    digest,
    packageId: "",
    upgradeCapId: "",
    publisherIds: [],
    created: [],
    mutated: []
  };
  if (objectChanges) {
    for (const change of objectChanges) {
      if ((change.type === "created" || change.type === "mutated") && change.objectType.endsWith("package::UpgradeCap")) {
        parseRes.upgradeCapId = change.objectId;
      } else if (change.type === "created" && change.objectType.endsWith("package::Publisher")) {
        parseRes.publisherIds.push(change.objectId);
      } else if (change.type === "published") {
        parseRes.packageId = change.packageId;
      } else if (change.type === "created") {
        const owner = parseOwnerFromObjectChange(change);
        parseRes.created.push({ type: change.objectType, objectId: change.objectId, owner });
      } else if (change.type === "mutated") {
        const owner = parseOwnerFromObjectChange(change);
        parseRes.mutated.push({ type: change.objectType, objectId: change.objectId, owner });
      }
    }
  }
  return parseRes;
};
var parseOwnerFromObjectChange = (change) => {
  const sender = change?.sender;
  if (typeof change.owner === "object" && "AddressOwner" in change.owner) {
    return change.owner.AddressOwner === sender ? `(you) ${sender}` : change.owner.AddressOwner;
  } else if (typeof change.owner === "object" && "Shared" in change.owner) {
    return "Shared";
  } else if (typeof change.owner === "object" && "Immutable" in change.owner) {
    return "Immutable";
  } else {
    return "";
  }
};

// src/sui/sui_wasm.ts
import_dotenv.default.config();
var wasm2 = SuiWasm.new_wasm();
var move_gen = MoveGen.new();
var move_code_helper = MoveCodeHelper.new();
function refresh_vm() {
  wasm2.refresh_vm();
}
function new_wasm() {
  return SuiWasm.new_wasm();
}
function new_move_code_helper() {
  return MoveCodeHelper.new();
}
function new_move_gen() {
  return MoveGen.new();
}
function get_wasm() {
  return wasm2;
}
function get_move_gen() {
  return move_gen;
}
function get_move_code_helper() {
  return move_code_helper;
}
function new_sui_client() {
  let network = get_config()?.network;
  if (network) {
    return new import_client3.SuiClient({ url: (0, import_client3.getFullnodeUrl)(network) });
    ;
  }
  return null;
}
async function sign_execute_transaction(client, tx) {
  const pair = (0, import_cryptography2.decodeSuiPrivateKey)(process.env.SUI_PRIVATE_KEY || "");
  const keypair = import_ed255192.Ed25519Keypair.fromSecretKey(pair.secretKey);
  return await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
    options: {
      showEffects: true
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Address,
  Ascii,
  Boolean,
  String,
  U128,
  U16,
  U256,
  U32,
  U64,
  U8,
  afterTest,
  afterTestAll,
  beforeTest,
  clone_chain_move_module,
  copy_arr_value,
  debug_move_function,
  deps_init,
  gen_move_ptb_scripts,
  gen_move_test_scripts,
  get_arr_bcs_vector,
  get_arr_deps,
  get_config,
  get_gas_cost,
  get_gas_report,
  get_move_code_helper,
  get_move_gen,
  get_object_address,
  get_package_address,
  get_wasm,
  has_arr,
  has_value,
  hexToNumArray,
  into_arr_bcs_vector,
  into_arr_value,
  isTransactionArgument,
  new_move_code_helper,
  new_move_gen,
  new_sui_client,
  new_wasm,
  publish_move_module,
  refresh_vm,
  set_config,
  setup,
  setup_move,
  setup_move_code_helper,
  setup_move_gen,
  sign_execute_transaction,
  to_arr_value,
  upgrade_move_module
});
/*! Bundled license information:

@scure/base/lib/esm/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
