///<reference path='typetester.ts'/>
///<reference path='fizzbuzz.ts'/>

class FizzBuzzTest extends TestCase {
	static TEST_ANOTATION = true;
	test_run_many() {
		this.setMethodDescription('15までの結合試験');

		var fb = new FizzBuzz();
		$Test('1').obj(fb.run(1)).should_be('1');
		$Test('2').obj(fb.run(2)).should_be('2');
		$Test('3').obj(fb.run(3)).should_be('Fizz');
		$Test('4').obj(fb.run(4)).should_be('4');
		$Test('5').obj(fb.run(5)).should_be('Buzz');
		$Test('6').obj(fb.run(6)).should_be('Fizz');
		$Test('7').obj(fb.run(7)).should_be('7');
		$Test('8').obj(fb.run(8)).should_be('8');
		$Test('9').obj(fb.run(9)).should_be('Fizz');
		$Test('10').obj(fb.run(10)).should_be('Buzz');
		$Test('11').obj(fb.run(11)).should_be('11');
		$Test('12').obj(fb.run(12)).should_be('Fizz');
		$Test('13').obj(fb.run(13)).should_be('13');
		$Test('14').obj(fb.run(14)).should_be('14');
		$Test('15').obj(fb.run(15)).should_be('Fizz, Buzz');
	}
}

class CSVbuilderTest extends TestCase {
	static TEST_ANOTATION = true;
	csvBuilder: CSVbuilder;

	getDescription(): string {
		return 'コンマ区切りの文字列が生成されるかをテストする'
	}

	setup(){
		this.csvBuilder = new CSVbuilder();
	}

	test_add_none() {
		this.setMethodDescription('addしなかった場合');
		$Test('addなし、nullを返す').obj(this.csvBuilder.build()).should_be_null();
	}

	test_add_one() {
		this.setMethodDescription('1つ追加した場合');
		this.csvBuilder.add('hoge');
		$Test('1つ追加した場合, そのまま返すこと').obj(this.csvBuilder.build()).should_be('hoge');
	}

	test_add_any() {
		this.setMethodDescription('1つ追加した場合');
		this.csvBuilder.add('hoge');
		this.csvBuilder.add('foo');

		$Test('2つ追加した場合, コンマくぎりでかえす').obj(this.csvBuilder.build()).should_be('hoge, foo');
	}
}