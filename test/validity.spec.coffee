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

  describe "lengthEquals", ->
    class Product
      Validity.define @,
        name: ['required', {lengthEquals: 10}]

    product = new Product

    it "errors when attribute missing", ->
      expect(product.isValid()).toBe(false)
      expect(product.isInvalid()).toBe(true)
      expect(product.errors).toEqual
        name: ["can't be blank", "must have exactly 10 characters"]

    it "is valid when attribute provided", ->
      product.name = '1234567890'

      expect(product.isValid()).toBe(true)
      expect(product.isInvalid()).toBe(false)
      expect(product.errors).toEqual []
