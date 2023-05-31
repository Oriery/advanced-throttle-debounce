var mocha = require('mocha');

module.exports = MarkdownReporter;

function MarkdownReporter(runner) {
  mocha.reporters.Base.call(this, runner);
  var passes = 0;
  var failures = 0;
  var output = '';

  output += '\n# TESTS:\n';
  output += 'status | test\n';
  output += '--- | ---\n';

  runner.on('pass', function(test){
    passes++;
    output += 'success | ' + test.fullTitle();
    output += '\n';
  });

  runner.on('fail', function(test, err){
    failures++;
    output += 'FAILED | ' + test.fullTitle() + ' -- error: ' + err.message;
    output += '\n';
  });

  runner.on('end', function(){
    console.log('\n# SUMMARY:\n');
    console.log('Passed: `%s`\n', passes);
    console.log('Failed: `%s`\n', failures);
    console.log('Total: `%s`\n', passes + failures);
    console.log(output);
  });
}

MarkdownReporter.prototype.__proto__ = mocha.reporters.Base.prototype;
