window.Validity =
  RULES:
    required: (object, attr) ->
      "can't be blank" unless object[attr]

    greaterThan: (object, attr, arg) ->
      "must be greater than #{arg}" unless Number(object[attr]) > arg

    greaterThanOrEqual: (object, attr, arg) ->
      "must be greater than or equal to #{arg}" unless Number(object[attr]) >= arg

    lessThan: (object, attr, arg) ->
      "must be less than #{arg}" unless Number(object[attr]) < arg

    lessThanOrEqual: (object, attr, arg) ->
      "must be less than or equal to #{arg}" unless Number(object[attr]) <= arg

    regex: (object, attr, arg) ->
      'is invalid' unless String(object[attr]).match(arg)

    length: (object, attr, arg) ->
      value = object[attr] || ''

      if typeof(arg) == 'number'
        "length must be #{arg}" if value.length != arg
      else if typeof(arg) == 'object'
        if length = arg['greaterThan']
          return "length must be greater than #{length}" if value.length < length

        if length = arg['lessThan']
          return "length must be less than #{length}" if value.length > length

    number: (object, attr) ->
      "must be a number" unless typeof(object[attr]) == 'number'

  _normalizeRules: (rules) ->
    self = this
    dict = {}

    for attr, def of rules
      self._normalizeRule(attr, def, dict)

    dict

  _normalizeRule: (attr, def, dict) ->
    dict[attr] ||= {}

    switch typeof(def)
      when 'string'
        dict[attr][def] = null

      when 'object'
        self = this

        if Array.isArray(def)
          for rule in def
            self._normalizeRule(attr, rule, dict)
        else
          for key, val of def
            dict[attr][key] = val

    dict

  define: (klass, rules={}) ->
    klass.validations = @_normalizeRules(rules)

    klass.prototype.validate = ->
      object = this
      @errors = {}

      for attr, validations of klass.validations
        value = object[attr]

        for name, arg of validations
          error = null

          if fn = Validity.RULES[name]
            error = fn(object, attr, arg)
          else
            fn = object[name]

            throw "Validator #{name} is not defined" unless fn && typeof(fn) == 'function'

            error = fn.apply(object, [attr, arg])

          if error
            object.errors[attr] ||= []
            object.errors[attr].push(error)

      @errors

    klass.prototype.isValid = ->
      @validate()

      for key, value of @errors
        return false

      true

    klass.prototype.isInvalid = -> !@isValid()
