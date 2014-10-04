describe "Validity", ->
  it "is valid with no validations", ->
    class Address
      Validity.define @

    address = new Address

    expect(address.isValid()).toBe(true)
    expect(address.isInvalid()).toBe(false)
    expect(address.errors).toEqual([])

  describe "required", ->
    class Address
      Validity.define @,
        firstName: 'required'

    address = new Address

    it "errors when attribute missing", ->
      expect(address.isValid()).toBe(false)
      expect(address.isInvalid()).toBe(true)
      expect(address.errors).toEqual
        firstName: ["can't be blank"]

    it "is valid when attribute provided", ->
      address.firstName = 'Josh'

      expect(address.isValid()).toBe(true)
      expect(address.isInvalid()).toBe(false)
      expect(address.errors).toEqual []

  describe "number", ->
    class Person
      Validity.define @,
        age: 'number'

    person = new Person

    it "errors when attribute missing", ->
      person.age = 'thirty'

      expect(person.isValid()).toBe(false)
      expect(person.isInvalid()).toBe(true)
      expect(person.errors).toEqual
        age: ["must be a number"]

    it "is valid when attribute provided", ->
      person.age = 30

      expect(person.isValid()).toBe(true)
      expect(person.isInvalid()).toBe(false)
      expect(person.errors).toEqual []

  describe "greaterThan", ->
    class Product
      Validity.define @,
        name: 'required'
        price: {greaterThan: 0}

    product = new Product

    it "errors when attribute missing", ->
      expect(product.isValid()).toBe(false)
      expect(product.isInvalid()).toBe(true)
      expect(product.errors).toEqual
        name: ["can't be blank"]
        price: ["must be greater than 0"]

    it "is valid when attribute provided", ->
      product.name = 'T-shirt'
      product.price = 10.99

      expect(product.isValid()).toBe(true)
      expect(product.isInvalid()).toBe(false)
      expect(product.errors).toEqual []

  describe "lessThan", ->
    class Product
      Validity.define @,
        name: 'required'
        price: {lessThan: 1000}

    product = new Product

    it "errors when attribute missing", ->
      expect(product.isValid()).toBe(false)
      expect(product.isInvalid()).toBe(true)
      expect(product.errors).toEqual
        name: ["can't be blank"]
        price: ["must be less than 1000"]

    it "is valid when attribute provided", ->
      product.name = 'T-shirt'
      product.price = 10.99

      expect(product.isValid()).toBe(true)
      expect(product.isInvalid()).toBe(false)
      expect(product.errors).toEqual []

  describe "greaterThanOrEqual", ->
    class Product
      Validity.define @,
        price: {greaterThanOrEqual: 0}

    product = new Product

    it "errors when attribute missing", ->
      product.price = -1

      expect(product.isValid()).toBe(false)
      expect(product.isInvalid()).toBe(true)
      expect(product.errors).toEqual
        price: ["must be greater than or equal to 0"]

    it "is valid when attribute provided", ->
      product.price = 0

      expect(product.isValid()).toBe(true)
      expect(product.isInvalid()).toBe(false)
      expect(product.errors).toEqual []

  describe "lessThanOrEqual", ->
    class Product
      Validity.define @,
        price: {lessThanOrEqual: 1000}

    product = new Product

    it "errors when attribute missing", ->
      product.price = 1001

      expect(product.isValid()).toBe(false)
      expect(product.isInvalid()).toBe(true)
      expect(product.errors).toEqual
        price: ["must be less than or equal to 1000"]

    it "is valid when attribute provided", ->
      product.price = 1000

      expect(product.isValid()).toBe(true)
      expect(product.isInvalid()).toBe(false)
      expect(product.errors).toEqual []

  describe "length", ->
    class Product
      Validity.define @,
        name: ['required', {length: 10}]
        sku: {length: {greaterThan: 5, lessThan: 8}}

    product = new Product

    it "errors when attribute missing", ->
      expect(product.isValid()).toBe(false)
      expect(product.isInvalid()).toBe(true)
      expect(product.errors).toEqual
        name: ["can't be blank", "length must be 10"]
        sku: ["length must be greater than 5"]

    it "errors when too long", ->
      product.sku = '01212121221'

      expect(product.isValid()).toBe(false)
      expect(product.isInvalid()).toBe(true)
      expect(product.errors).toEqual
        name: ["can't be blank", "length must be 10"]
        sku: ["length must be less than 8"]

    it "errors when too short", ->
      product.sku = '123'

      expect(product.isValid()).toBe(false)
      expect(product.isInvalid()).toBe(true)
      expect(product.errors).toEqual
        name: ["can't be blank", "length must be 10"]
        sku: ["length must be greater than 5"]

    it "is valid when length is correct", ->
      product.name = '1234567890'
      product.sku = '1234567'

      expect(product.isValid()).toBe(true)
      expect(product.isInvalid()).toBe(false)
      expect(product.errors).toEqual []

  describe "regex", ->
    class Person
      Validity.define @,
        email: {regex: /.+\@.+\..+/}

    person = new Person

    it "errors when attribute missing", ->
      expect(person.isValid()).toBe(false)
      expect(person.isInvalid()).toBe(true)
      expect(person.errors).toEqual
        email: ["is invalid"]

    it "is invalid when regex doesnt match", ->
      person.email = 'billg'

      expect(person.isValid()).toBe(false)
      expect(person.isInvalid()).toBe(true)
      expect(person.errors).toEqual
        email: ["is invalid"]

    it "is valid when attribute provided", ->
      person.email = 'billg@microsoft.com'

      expect(person.isValid()).toBe(true)
      expect(person.isInvalid()).toBe(false)
      expect(person.errors).toEqual []

  describe "custom validator", ->
    class Product
      Validity.define @,
        name: 'isValidName'

      isValidName: ->
        'oops' unless @name == 'magic'

    product = new Product

    it "errors when attribute missing", ->
      expect(product.isValid()).toBe(false)
      expect(product.isInvalid()).toBe(true)
      expect(product.errors).toEqual
        name: ["oops"]

    it "is valid when attribute provided", ->
      product.name = 'magic'

      expect(product.isValid()).toBe(true)
      expect(product.isInvalid()).toBe(false)
      expect(product.errors).toEqual []
