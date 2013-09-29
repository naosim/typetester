class CSVbuilder {
	private values: string[] = [];
	add(value: string) {
		this.values.push(value);
	}
	length() {
		return this.values.length;
	}

	build(): string {
		if(this.values.length == 0) return null;

		var result = '';
		for(var i = 0; i < this.values.length; i++) {
			if(i > 0) result += ', ';
			result += this.values[i];
		}
		return result;
	}
}

class FizzBuzz {
	NUM_FIZZ = 3;
	NUM_BUZZ = 5;
	run(num: number): string {
		var csvBuilder = new CSVbuilder();
		if(num % this.NUM_FIZZ == 0) csvBuilder.add('Fizz');
		if(num % this.NUM_BUZZ == 0) csvBuilder.add('Buzz');
		if(csvBuilder.length() == 0) csvBuilder.add('' + num);
		return csvBuilder.build();
	}
}
