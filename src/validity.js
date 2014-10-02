(function() {
  window.Validity = {
    RULES: {
      required: function(object, attr) {
        if (!object[attr]) {
          return "can't be blank";
        }
      },
      greaterThan: function(object, attr, arg) {
        if (!(Number(object[attr]) > arg)) {
          return "must be greater than " + arg;
        }
      },
      greaterThanOrEqual: function(object, attr, arg) {
        if (!(Number(object[attr]) >= arg)) {
          return "must be greater than or equal to " + arg;
        }
      },
      lessThan: function(object, attr, arg) {
        if (!(Number(object[attr]) < arg)) {
          return "must be less than " + arg;
        }
      },
      lessThanOrEqual: function(object, attr, arg) {
        if (!(Number(object[attr]) <= arg)) {
          return "must be less than or equal to " + arg;
        }
      },
      lengthEquals: function(object, attr, arg) {
        if (String(object[attr]).length !== arg) {
          return "must have exactly " + arg + " characters";
        }
      }
    },
    _normalizeRules: function(rules) {
      var attr, def, dict, self;
      self = this;
      dict = {};
      for (attr in rules) {
        def = rules[attr];
        self._normalizeRule(attr, def, dict);
      }
      return dict;
    },
    _normalizeRule: function(attr, def, dict) {
      var key, rule, self, val, _i, _len;
      dict[attr] || (dict[attr] = {});
      switch (typeof def) {
        case 'string':
          dict[attr][def] = null;
          break;
        case 'object':
          self = this;
          if (Array.isArray(def)) {
            for (_i = 0, _len = def.length; _i < _len; _i++) {
              rule = def[_i];
              self._normalizeRule(attr, rule, dict);
            }
          } else {
            for (key in def) {
              val = def[key];
              dict[attr][key] = val;
            }
          }
      }
      return dict;
    },
    define: function(klass, rules) {
      if (rules == null) {
        rules = {};
      }
      klass.validations = this._normalizeRules(rules);
      klass.prototype.validate = function() {
        var arg, attr, error, fn, name, object, validations, value, _base, _ref;
        object = this;
        this.errors = {};
        _ref = klass.validations;
        for (attr in _ref) {
          validations = _ref[attr];
          value = object[attr];
          for (name in validations) {
            arg = validations[name];
            error = null;
            if (fn = Validity.RULES[name]) {
              error = fn(object, attr, arg);
            } else {
              error = object[name](attr, arg);
            }
            if (error) {
              (_base = object.errors)[attr] || (_base[attr] = []);
              object.errors[attr].push(error);
            }
          }
        }
        return this.errors;
      };
      klass.prototype.isValid = function() {
        var key, value, _ref;
        this.validate();
        _ref = this.errors;
        for (key in _ref) {
          value = _ref[key];
          return false;
        }
        return true;
      };
      return klass.prototype.isInvalid = function() {
        return !this.isValid();
      };
    }
  };

}).call(this);
