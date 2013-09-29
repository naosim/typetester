class TestReport {
	name: string;
	description: string;
	failedCount: number = 0;
	failedMessage: string = "";
	subReports: TestReport[] = [];
	constructor(name: string) {
		this.name = name;
	}

	getOKCount(): number {
		return this.getTotalCount() - this.failedCount;
	}

	getTotalCount(): number {
		return this.subReports.length;
	}

	// NGの数を数える
	validFailedCount() {
		for(var i = 0; i < this.subReports.length; i++) {
			if(this.subReports[i].failedCount != 0)this.failedCount++;
		}
	}
}

interface ReportDecorater {
	writeOneReport(report: TestReport, indent:number): string;
	writeTotal(total: TotalReport): string;
}

class TextReportDecorater implements ReportDecorater{
	writeOneReport(report: TestReport, indent:number): string {
		var space = "";
		for(var i = 0; i < indent; i++) {
			space += "  ";
		}
		var result = space + report.name;
		if(report.description) result += "(" + report.description + ")";
		if(report.getTotalCount() != 0) result += '(' + report.getOKCount() + '/' + report.getTotalCount() + ')'
		result += ' -> ' + (report.failedCount == 0 ? 'OK' : 'NG' + (report.failedMessage.length != 0 ? ': ' + report.failedMessage : '')) + '\n'; 
		return result;
	}

	writeTotal(total: TotalReport): string {
		var result = '\n------------------------------------------------\n';
		result += 'total: ' + total.total + ', ';
		result += 'OK: ' + total.ok + ', ';
		result += 'failed: ' + total.failed + '\n';
		result += '-> ' + (total.total == total.ok ? 'SUCCESS' : 'FAILED'); 
		result += '\n------------------------------------------------\n';
		return result;
	}

}

class HTMLReportDecorater implements ReportDecorater{
	writeOneReport(report: TestReport, indent:number): string {
		var space = "";
		for(var i = 0; i < indent; i++) {
			space += "&nbsp;&nbsp;";
		}
		var result = "";
		result += space;
		result += report.getTotalCount() > 0 ? '+ ' : '- ';
		result += report.name;
		if(report.description) result += "(" + report.description + ")";
		if(report.getTotalCount() != 0) result += '(' + report.getOKCount() + '/' + report.getTotalCount() + ')'
		result += ' -> ' + (report.failedCount == 0 ? 'OK' : 'NG' + (report.failedMessage.length != 0 ? ': ' + report.failedMessage : '')) + '<br />\n'; 

		return result;
	}

	writeTotal(total: TotalReport): string {
		var result = '\n<hr />\n';
		result += 'total: ' + total.total + ', ';
		result += 'OK: ' + total.ok + ', ';
		result += 'failed: ' + total.failed + '<br />\n';
		result += '-> ' + (total.total == total.ok ? 'SUCCESS' : 'FAILED'); 
		result += '\n<hr />\n';
		return result;
	}

}

class TextReportWriter {
	private report: TestReport;
	private decorater: ReportDecorater;
	constructor(report: TestReport, decorater: ReportDecorater) {
		this.report = report;
		this.decorater = decorater;
	}
	write(report?: TestReport, indent?: number = 0): string {
		if(!report) {
			var result = this.write(this.report);
			var total = this.totalResult();
			result += this.decorater.writeTotal(total);

			return result;
		}

		var result = this.decorater.writeOneReport(report, indent);
		if(report.subReports) {
			for(var i = 0; i < report.subReports.length; i++) {
				result += this.write(report.subReports[i], indent + 1);
			}
		}
		return result;
	}
	
	totalResult(report?: TestReport, result?: TotalReport): TotalReport {
		if(!report) {
			return this.totalResult(this.report, {total: 0, ok:0, failed: 0});
		}

		if(report.subReports && report.subReports.length > 0) {
			for(var i = 0; i < report.subReports.length; i++) {
				result = this.totalResult(report.subReports[i], result);
			}
		} else {
			result.total++;
			if(report.failedCount > 0) {
				result.failed++;
			} else {
				result.ok++;
			}
		}

		return result;

	}
}

interface TotalReport {
	total: number;
	ok: number;
	failed: number;
}


class Test {
	message: string;
	constructor(message?: string = '') {
		this.message = message;
	}

	obj(act: Object): ObjectAssert {
		return new ObjectAssert(act, this.message);
	}

	condition(act: bool): ConditionAssert {
		return new ConditionAssert(act, this.message);
	}

	num(act: number): NumberAssert {
		return new NumberAssert(act, this.message);
	}
}

class ObjectAssert {
	obj;
	message: string;
	constructor(obj, message?: string = '') {
		this.obj = obj;
		this.message = message;
	}
	should_be_null() {
		if(this.obj !== null) {
			throw 'not null: typeof ' + typeof(this.obj) + this.message;
		}
	}

	should_be_undefined(message?: string = "") {
		if(this.obj !== undefined) {
			throw 'not undefined: typeof ' + typeof(this.obj) + this.message;
		}
	}

	should_be_not_undefined(message?: string = "") {
		if(this.obj === undefined) {
			throw 'undefined: ' + this.message;
		}
	}

	should_be(exp) {
		if(exp !== this.obj) {
			throw 'exp(' + exp + ') !== act(' + this.obj + '): ' + this.message;
		}
	}
}

class ConditionAssert extends ObjectAssert {
	condition: bool;
	constructor(condition: bool, message?: string = '') {
		super(condition, message);
		this.condition = condition;
	}
	should_be_true() {
		if(this.condition !== true) {
			throw 'assertTrue(' + this.message + ')';
		}
	}

	should_be_false() {
		if(this.condition === true) {
			throw 'assertFalse(' + this.message + ')';
		}
	}
}

class NumberAssert extends ObjectAssert {
	num: number;
	constructor(num: number, message?: string = '') {
		super(num, message);
		this.num = num;
	}

	should_be(exp: number) {
		super.should_be(exp);
	}
}

// ex) $Test('A should be null.').obj(A).should_be_null();
function $Test(message?: string = ''): Test {
	return new Test(message);

}

class TestCase {
	private currentMethodName: string;
	private currentMethodDescription: string;

	run(): TestReport {
		var testMethodNames = this.getTestMethodNames();

		var report = new TestReport(this['constructor'].name);
		report.description = this.getDescription();
		for(var i = 0; i < testMethodNames.length; i++) {
			var methodReport: TestReport = this.runOneTest(testMethodNames[i]);
			report.subReports.push(methodReport);
		}
		report.validFailedCount();
		return report;
	}

	public setMethodDescription(description: string) {
		this.currentMethodDescription = description;
	}

	private getTestMethodNames(): string[] {
		var testMethodNames:string[] = [];
		for(var key in this) {
			if(key.indexOf('test') == 0 && typeof(this[key]) == 'function') {
				testMethodNames.push(key);
			}
		}
		return testMethodNames;
	}

	runOneTest(testMethodName: string): TestReport {
		var report = new TestReport(testMethodName);
		this.currentMethodName = testMethodName;

		this.currentMethodDescription = null;
		this.setup();
		try {
			this[this.currentMethodName]();
		} catch(e) {
			report.failedCount++;
			report.failedMessage = e;
		}
		this.tearDown();

		if(this.currentMethodDescription !== null) {
			report.description = this.currentMethodDescription;
		}

		return report;
	}
	getDescription(): string {return null}
	setup(){}
	tearDown(){}
}

/*
アノテーションがついたものをテストケースとみなして実行する
*/
var runTests = function() {
	var report = new TestReport('ALL');
	for(var key in this) {
		if(key.indexOf('Test') == -1 || typeof(this[key]) != 'function' || !this[key].TEST_ANOTATION) continue;

		var test = new this[key]();
		var classReport = test.run();
		report.subReports.push(classReport);
	}
	report.validFailedCount();
	return report;
}

// run one test on console
var runTestMethod = function(testClassName: string, testMethodName: string) {
	return new this[testClassName]().runOneTest(testMethodName);
}

// run tests after load
window.addEventListener("load", ()=>{
	var report = runTests();

	var writer = new TextReportWriter(report, new HTMLReportDecorater());
	//console.log(writer.write());
	//document.write(writer.write());
	var body: any;
	body = document.getElementsByTagName('body')[0];

	var bgColor = report.failedCount == 0 ? '"#88ff88"' : '"#ff8888"';
	body.outerHTML = '<body bgcolor=' + bgColor + '><code style="font-family: Consolas, \'Courier New\', Courier, Monaco, monospace;">' + writer.write() + '</code></body>';

	if(report.failedCount == 0) {
		setTimeout(function() {
			window.location.reload();
		}, 5 * 60 * 1000);
	}
});
