messages =
  required: "can't be blank"
  greaterThan: "must be greater than %arg"
  greaterThanOrEqual: "must be greater than or equal to %arg"
  lessThan: "must be less than %arg"
  lessThanOrEqual: "must be less than or equal to %arg"
  regex: 'is invalid'
  length: "length must be %length"
  lengthGreaterThan: "length must be greater than %length"
  lengthLessThan: "length must be less than %length"
  number: "must be a number"

formatMessage = (messageKey, args) ->
  message = messages[messageKey]

  for key, value of args
    regex   = RegExp("%#{key}", "g")
    message = message.replace(regex, value)

  message

window.Validity =
  MESSAGES: messages

  RULES:
    required: (object, attr) ->
      formatMessage('required', field: attr) unless object[attr]

    greaterThan: (object, attr, arg) ->
      formatMessage('greaterThan', field: attr, arg: arg) unless Number(object[attr]) > arg

    greaterThanOrEqual: (object, attr, arg) ->
      formatMessage('greaterThanOrEqual', field: attr, arg: arg) unless Number(object[attr]) >= arg

    lessThan: (object, attr, arg) ->
      formatMessage('lessThan', field: attr, arg: arg) unless Number(object[attr]) < arg

    lessThanOrEqual: (object, attr, arg) ->
      formatMessage('lessThanOrEqual', field: attr, arg: arg) unless Number(object[attr]) <= arg

    regex: (object, attr, arg) ->
      formatMessage('regex', field: attr) unless String(object[attr]).match(arg)

    length: (object, attr, arg) ->
      value = object[attr] || ''

      if typeof(arg) == 'number'
        formatMessage('length', field: attr, length: arg) if value.length != arg
      else if typeof(arg) == 'object'
        if length = arg['greaterThan']
          return formatMessage('lengthGreaterThan', field: attr, length: length) if value.length < length

        if length = arg['lessThan']
          return formatMessage('lengthLessThan', field: attr, length: length) if value.length > length

    number: (object, attr) ->
      formatMessage('number', field: attr) unless typeof(object[attr]) == 'number'

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
