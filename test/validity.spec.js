(function() {
  describe("Validity", function() {
    it("is valid with no validations", function() {
      var Address, address;
      Address = (function() {
        function Address() {}

        Validity.define(Address);

        return Address;

      })();
      address = new Address;
      expect(address.isValid()).toBe(true);
      expect(address.isInvalid()).toBe(false);
      return expect(address.errors).toEqual([]);
    });
    describe("required", function() {
      var Address, address;
      Address = (function() {
        function Address() {}

        Validity.define(Address, {
          firstName: 'required'
        });

        return Address;

      })();
      address = new Address;
      it("errors when attribute missing", function() {
        expect(address.isValid()).toBe(false);
        expect(address.isInvalid()).toBe(true);
        return expect(address.errors).toEqual({
          firstName: ["can't be blank"]
        });
      });
      return it("is valid when attribute provided", function() {
        address.firstName = 'Josh';
        expect(address.isValid()).toBe(true);
        expect(address.isInvalid()).toBe(false);
        return expect(address.errors).toEqual([]);
      });
    });
    describe("number", function() {
      var Person, person;
      Person = (function() {
        function Person() {}

        Validity.define(Person, {
          age: 'number'
        });

        return Person;

      })();
      person = new Person;
      it("errors when attribute missing", function() {
        person.age = 'thirty';
        expect(person.isValid()).toBe(false);
        expect(person.isInvalid()).toBe(true);
        return expect(person.errors).toEqual({
          age: ["must be a number"]
        });
      });
      return it("is valid when attribute provided", function() {
        person.age = 30;
        expect(person.isValid()).toBe(true);
        expect(person.isInvalid()).toBe(false);
        return expect(person.errors).toEqual([]);
      });
    });
    describe("greaterThan", function() {
      var Product, product;
      Product = (function() {
        function Product() {}

        Validity.define(Product, {
          name: 'required',
          price: {
            greaterThan: 0
          }
        });

        return Product;

      })();
      product = new Product;
      it("errors when attribute missing", function() {
        expect(product.isValid()).toBe(false);
        expect(product.isInvalid()).toBe(true);
        return expect(product.errors).toEqual({
          name: ["can't be blank"],
          price: ["must be greater than 0"]
        });
      });
      return it("is valid when attribute provided", function() {
        product.name = 'T-shirt';
        product.price = 10.99;
        expect(product.isValid()).toBe(true);
        expect(product.isInvalid()).toBe(false);
        return expect(product.errors).toEqual([]);
      });
    });
    describe("lessThan", function() {
      var Product, product;
      Product = (function() {
        function Product() {}

        Validity.define(Product, {
          name: 'required',
          price: {
            lessThan: 1000
          }
        });

        return Product;

      })();
      product = new Product;
      it("errors when attribute missing", function() {
        expect(product.isValid()).toBe(false);
        expect(product.isInvalid()).toBe(true);
        return expect(product.errors).toEqual({
          name: ["can't be blank"],
          price: ["must be less than 1000"]
        });
      });
      return it("is valid when attribute provided", function() {
        product.name = 'T-shirt';
        product.price = 10.99;
        expect(product.isValid()).toBe(true);
        expect(product.isInvalid()).toBe(false);
        return expect(product.errors).toEqual([]);
      });
    });
    describe("greaterThanOrEqual", function() {
      var Product, product;
      Product = (function() {
        function Product() {}

        Validity.define(Product, {
          price: {
            greaterThanOrEqual: 0
          }
        });

        return Product;

      })();
      product = new Product;
      it("errors when attribute missing", function() {
        product.price = -1;
        expect(product.isValid()).toBe(false);
        expect(product.isInvalid()).toBe(true);
        return expect(product.errors).toEqual({
          price: ["must be greater than or equal to 0"]
        });
      });
      return it("is valid when attribute provided", function() {
        product.price = 0;
        expect(product.isValid()).toBe(true);
        expect(product.isInvalid()).toBe(false);
        return expect(product.errors).toEqual([]);
      });
    });
    describe("lessThanOrEqual", function() {
      var Product, product;
      Product = (function() {
        function Product() {}

        Validity.define(Product, {
          price: {
            lessThanOrEqual: 1000
          }
        });

        return Product;

      })();
      product = new Product;
      it("errors when attribute missing", function() {
        product.price = 1001;
        expect(product.isValid()).toBe(false);
        expect(product.isInvalid()).toBe(true);
        return expect(product.errors).toEqual({
          price: ["must be less than or equal to 1000"]
        });
      });
      return it("is valid when attribute provided", function() {
        product.price = 1000;
        expect(product.isValid()).toBe(true);
        expect(product.isInvalid()).toBe(false);
        return expect(product.errors).toEqual([]);
      });
    });
    describe("length", function() {
      var Product, product;
      Product = (function() {
        function Product() {}

        Validity.define(Product, {
          name: [
            'required', {
              length: 10
            }
          ],
          sku: {
            length: {
              greaterThan: 5,
              lessThan: 8
            }
          }
        });

        return Product;

      })();
      product = new Product;
      it("errors when attribute missing", function() {
        expect(product.isValid()).toBe(false);
        expect(product.isInvalid()).toBe(true);
        return expect(product.errors).toEqual({
          name: ["can't be blank", "length must be 10"],
          sku: ["length must be greater than 5"]
        });
      });
      it("errors when too long", function() {
        product.sku = '01212121221';
        expect(product.isValid()).toBe(false);
        expect(product.isInvalid()).toBe(true);
        return expect(product.errors).toEqual({
          name: ["can't be blank", "length must be 10"],
          sku: ["length must be less than 8"]
        });
      });
      it("errors when too short", function() {
        product.sku = '123';
        expect(product.isValid()).toBe(false);
        expect(product.isInvalid()).toBe(true);
        return expect(product.errors).toEqual({
          name: ["can't be blank", "length must be 10"],
          sku: ["length must be greater than 5"]
        });
      });
      return it("is valid when length is correct", function() {
        product.name = '1234567890';
        product.sku = '1234567';
        expect(product.isValid()).toBe(true);
        expect(product.isInvalid()).toBe(false);
        return expect(product.errors).toEqual([]);
      });
    });
    describe("regex", function() {
      var Person, person;
      Person = (function() {
        function Person() {}

        Validity.define(Person, {
          email: {
            regex: /.+\@.+\..+/
          }
        });

        return Person;

      })();
      person = new Person;
      it("errors when attribute missing", function() {
        expect(person.isValid()).toBe(false);
        expect(person.isInvalid()).toBe(true);
        return expect(person.errors).toEqual({
          email: ["is invalid"]
        });
      });
      it("is invalid when regex doesnt match", function() {
        person.email = 'billg';
        expect(person.isValid()).toBe(false);
        expect(person.isInvalid()).toBe(true);
        return expect(person.errors).toEqual({
          email: ["is invalid"]
        });
      });
      return it("is valid when attribute provided", function() {
        person.email = 'billg@microsoft.com';
        expect(person.isValid()).toBe(true);
        expect(person.isInvalid()).toBe(false);
        return expect(person.errors).toEqual([]);
      });
    });
    return describe("custom validator", function() {
      var Product, product;
      Product = (function() {
        function Product() {}

        Validity.define(Product, {
          name: 'isValidName'
        });

        Product.prototype.isValidName = function() {
          if (this.name !== 'magic') {
            return 'oops';
          }
        };

        return Product;

      })();
      product = new Product;
      it("errors when attribute missing", function() {
        expect(product.isValid()).toBe(false);
        expect(product.isInvalid()).toBe(true);
        return expect(product.errors).toEqual({
          name: ["oops"]
        });
      });
      return it("is valid when attribute provided", function() {
        product.name = 'magic';
        expect(product.isValid()).toBe(true);
        expect(product.isInvalid()).toBe(false);
        return expect(product.errors).toEqual([]);
      });
    });
  });

}).call(this);
