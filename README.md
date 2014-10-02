# Validity

A validation framework for JavaScript models.

## Features

- Wide variety of built in validators.
- Integrates easily with server side validation (i.e rails, node)
- Supports class-specific validations.
- Easy to add new site-wide validators, via the `Validity.RULES` dictionary.
- Works great with jQuery and Angular.js


## Example

```coffeescript
# Define a class with some validation rules
class Person
  Validity.define @,
    name: 'required'
    age: {greaterThan: 0}
    zipcode: ['required', {lengthEquals: 5}]

person = new Person
person.isValid() #= false
person.errors #= {name: ["can't be blank"], age: ["must be greater than 0"], zipcode: ["can't be blank", "must have exactly 5 characters"]}

person.name = 'John Smith'
person.age = 47
person.zipcode = '12345'
person.isValid() #= true
person.errors #= {}
```

## Installation

`bower install validity`

## Supported Validations

- required
- greater than
- less than
- equal to
- custom validators

### Upcoming

- number
- regex
- greater than or equal
- less than or equal
