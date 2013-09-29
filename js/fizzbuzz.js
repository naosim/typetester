var CSVbuilder = (function () {
    function CSVbuilder() {
        this.values = [];
    }
    CSVbuilder.prototype.add = function (value) {
        this.values.push(value);
    };
    CSVbuilder.prototype.length = function () {
        return this.values.length;
    };
    CSVbuilder.prototype.build = function () {
        if(this.values.length == 0) {
            return null;
        }
        var result = '';
        for(var i = 0; i < this.values.length; i++) {
            if(i > 0) {
                result += ', ';
            }
            result += this.values[i];
        }
        return result;
    };
    return CSVbuilder;
})();
var FizzBuzz = (function () {
    function FizzBuzz() {
        this.NUM_FIZZ = 3;
        this.NUM_BUZZ = 5;
    }
    FizzBuzz.prototype.run = function (num) {
        var csvBuilder = new CSVbuilder();
        if(num % this.NUM_FIZZ == 0) {
            csvBuilder.add('Fizz');
        }
        if(num % this.NUM_BUZZ == 0) {
            csvBuilder.add('Buzz');
        }
        if(csvBuilder.length() == 0) {
            csvBuilder.add('' + num);
        }
        return csvBuilder.build();
    };
    return FizzBuzz;
})();
