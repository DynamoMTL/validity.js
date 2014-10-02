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
    describe("lengthEquals", function() {
      var Product, product;
      Product = (function() {
        function Product() {}

        Validity.define(Product, {
          name: [
            'required', {
              lengthEquals: 10
            }
          ]
        });

        return Product;

      })();
      product = new Product;
      it("errors when attribute missing", function() {
        expect(product.isValid()).toBe(false);
        expect(product.isInvalid()).toBe(true);
        return expect(product.errors).toEqual({
          name: ["can't be blank", "must have exactly 10 characters"]
        });
      });
      return it("is valid when attribute provided", function() {
        product.name = '1234567890';
        expect(product.isValid()).toBe(true);
        expect(product.isInvalid()).toBe(false);
        return expect(product.errors).toEqual([]);
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
