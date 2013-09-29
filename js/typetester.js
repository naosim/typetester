var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var TestReport = (function () {
    function TestReport(name) {
        this.failedCount = 0;
        this.failedMessage = "";
        this.subReports = [];
        this.name = name;
    }
    TestReport.prototype.getOKCount = function () {
        return this.getTotalCount() - this.failedCount;
    };
    TestReport.prototype.getTotalCount = function () {
        return this.subReports.length;
    };
    TestReport.prototype.validFailedCount = function () {
        for(var i = 0; i < this.subReports.length; i++) {
            if(this.subReports[i].failedCount != 0) {
                this.failedCount++;
            }
        }
    };
    return TestReport;
})();
var TextReportDecorater = (function () {
    function TextReportDecorater() { }
    TextReportDecorater.prototype.writeOneReport = function (report, indent) {
        var space = "";
        for(var i = 0; i < indent; i++) {
            space += "  ";
        }
        var result = space + report.name;
        if(report.description) {
            result += "(" + report.description + ")";
        }
        if(report.getTotalCount() != 0) {
            result += '(' + report.getOKCount() + '/' + report.getTotalCount() + ')';
        }
        result += ' -> ' + (report.failedCount == 0 ? 'OK' : 'NG' + (report.failedMessage.length != 0 ? ': ' + report.failedMessage : '')) + '\n';
        return result;
    };
    TextReportDecorater.prototype.writeTotal = function (total) {
        var result = '\n------------------------------------------------\n';
        result += 'total: ' + total.total + ', ';
        result += 'OK: ' + total.ok + ', ';
        result += 'failed: ' + total.failed + '\n';
        result += '-> ' + (total.total == total.ok ? 'SUCCESS' : 'FAILED');
        result += '\n------------------------------------------------\n';
        return result;
    };
    return TextReportDecorater;
})();
var HTMLReportDecorater = (function () {
    function HTMLReportDecorater() { }
    HTMLReportDecorater.prototype.writeOneReport = function (report, indent) {
        var space = "";
        for(var i = 0; i < indent; i++) {
            space += "&nbsp;&nbsp;";
        }
        var result = "";
        result += space;
        result += report.getTotalCount() > 0 ? '+ ' : '- ';
        result += report.name;
        if(report.description) {
            result += "(" + report.description + ")";
        }
        if(report.getTotalCount() != 0) {
            result += '(' + report.getOKCount() + '/' + report.getTotalCount() + ')';
        }
        result += ' -> ' + (report.failedCount == 0 ? 'OK' : 'NG' + (report.failedMessage.length != 0 ? ': ' + report.failedMessage : '')) + '<br />\n';
        return result;
    };
    HTMLReportDecorater.prototype.writeTotal = function (total) {
        var result = '\n<hr />\n';
        result += 'total: ' + total.total + ', ';
        result += 'OK: ' + total.ok + ', ';
        result += 'failed: ' + total.failed + '<br />\n';
        result += '-> ' + (total.total == total.ok ? 'SUCCESS' : 'FAILED');
        result += '\n<hr />\n';
        return result;
    };
    return HTMLReportDecorater;
})();
var TextReportWriter = (function () {
    function TextReportWriter(report, decorater) {
        this.report = report;
        this.decorater = decorater;
    }
    TextReportWriter.prototype.write = function (report, indent) {
        if (typeof indent === "undefined") { indent = 0; }
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
    };
    TextReportWriter.prototype.totalResult = function (report, result) {
        if(!report) {
            return this.totalResult(this.report, {
                total: 0,
                ok: 0,
                failed: 0
            });
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
    };
    return TextReportWriter;
})();
var Test = (function () {
    function Test(message) {
        if (typeof message === "undefined") { message = ''; }
        this.message = message;
    }
    Test.prototype.obj = function (act) {
        return new ObjectAssert(act, this.message);
    };
    Test.prototype.condition = function (act) {
        return new ConditionAssert(act, this.message);
    };
    Test.prototype.num = function (act) {
        return new NumberAssert(act, this.message);
    };
    return Test;
})();
var ObjectAssert = (function () {
    function ObjectAssert(obj, message) {
        if (typeof message === "undefined") { message = ''; }
        this.obj = obj;
        this.message = message;
    }
    ObjectAssert.prototype.should_be_null = function () {
        if(this.obj !== null) {
            throw 'not null: typeof ' + typeof (this.obj) + this.message;
        }
    };
    ObjectAssert.prototype.should_be_undefined = function (message) {
        if (typeof message === "undefined") { message = ""; }
        if(this.obj !== undefined) {
            throw 'not undefined: typeof ' + typeof (this.obj) + this.message;
        }
    };
    ObjectAssert.prototype.should_be_not_undefined = function (message) {
        if (typeof message === "undefined") { message = ""; }
        if(this.obj === undefined) {
            throw 'undefined: ' + this.message;
        }
    };
    ObjectAssert.prototype.should_be = function (exp) {
        if(exp !== this.obj) {
            throw 'exp(' + exp + ') !== act(' + this.obj + '): ' + this.message;
        }
    };
    return ObjectAssert;
})();
var ConditionAssert = (function (_super) {
    __extends(ConditionAssert, _super);
    function ConditionAssert(condition, message) {
        if (typeof message === "undefined") { message = ''; }
        _super.call(this, condition, message);
        this.condition = condition;
    }
    ConditionAssert.prototype.should_be_true = function () {
        if(this.condition !== true) {
            throw 'assertTrue(' + this.message + ')';
        }
    };
    ConditionAssert.prototype.should_be_false = function () {
        if(this.condition === true) {
            throw 'assertFalse(' + this.message + ')';
        }
    };
    return ConditionAssert;
})(ObjectAssert);
var NumberAssert = (function (_super) {
    __extends(NumberAssert, _super);
    function NumberAssert(num, message) {
        if (typeof message === "undefined") { message = ''; }
        _super.call(this, num, message);
        this.num = num;
    }
    NumberAssert.prototype.should_be = function (exp) {
        _super.prototype.should_be.call(this, exp);
    };
    return NumberAssert;
})(ObjectAssert);
function $Test(message) {
    if (typeof message === "undefined") { message = ''; }
    return new Test(message);
}
var TestCase = (function () {
    function TestCase() { }
    TestCase.prototype.run = function () {
        var testMethodNames = this.getTestMethodNames();
        var report = new TestReport(this['constructor'].name);
        report.description = this.getDescription();
        for(var i = 0; i < testMethodNames.length; i++) {
            var methodReport = this.runOneTest(testMethodNames[i]);
            report.subReports.push(methodReport);
        }
        report.validFailedCount();
        return report;
    };
    TestCase.prototype.setMethodDescription = function (description) {
        this.currentMethodDescription = description;
    };
    TestCase.prototype.getTestMethodNames = function () {
        var testMethodNames = [];
        for(var key in this) {
            if(key.indexOf('test') == 0 && typeof (this[key]) == 'function') {
                testMethodNames.push(key);
            }
        }
        return testMethodNames;
    };
    TestCase.prototype.runOneTest = function (testMethodName) {
        var report = new TestReport(testMethodName);
        this.currentMethodName = testMethodName;
        this.currentMethodDescription = null;
        this.setup();
        try  {
            this[this.currentMethodName]();
        } catch (e) {
            report.failedCount++;
            report.failedMessage = e;
        }
        this.tearDown();
        if(this.currentMethodDescription !== null) {
            report.description = this.currentMethodDescription;
        }
        return report;
    };
    TestCase.prototype.getDescription = function () {
        return null;
    };
    TestCase.prototype.setup = function () {
    };
    TestCase.prototype.tearDown = function () {
    };
    return TestCase;
})();
var runTests = function () {
    var report = new TestReport('ALL');
    for(var key in this) {
        if(key.indexOf('Test') == -1 || typeof (this[key]) != 'function' || !this[key].TEST_ANOTATION) {
            continue;
        }
        var test = new this[key]();
        var classReport = test.run();
        report.subReports.push(classReport);
    }
    report.validFailedCount();
    return report;
};
var runTestMethod = function (testClassName, testMethodName) {
    return new this[testClassName]().runOneTest(testMethodName);
};
window.addEventListener("load", function () {
    var report = runTests();
    var writer = new TextReportWriter(report, new HTMLReportDecorater());
    var body;
    body = document.getElementsByTagName('body')[0];
    var bgColor = report.failedCount == 0 ? '"#88ff88"' : '"#ff8888"';
    body.outerHTML = '<body bgcolor=' + bgColor + '><code style="font-family: Consolas, \'Courier New\', Courier, Monaco, monospace;">' + writer.write() + '</code></body>';
    if(report.failedCount == 0) {
        setTimeout(function () {
            window.location.reload();
        }, 5 * 60 * 1000);
    }
});
