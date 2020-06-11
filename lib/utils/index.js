const rp = require('child_process');
function curry(fn, ...args) {
  if (args.length >= fn.length) {
    return fn.apply(fn, args);
  }
  return (...args1) => {
    return curry(fn, ...args, ...args1);
  };
}

function compose(...fns) {
  return (value) => {
    return fns.reverse().reduce((acc, fn) => {
      return fn(acc);
    }, value);
  };
}

const getLastItemInArr = curry(function (arr) {
  return arr[arr.length - 1];
});

const split = curry(function (splitReg, str) {
  return str.split(splitReg);
});

const getGitInfo = curry((key, fn, str) => {
  return str + fn(rp.execSync(`git config user.${key}`).toString());
});

const replace = curry((replaceReg, replaceContent, str) => {
  return str.replace(replaceReg, replaceContent);
});

exports.getProjectName = compose(getLastItemInArr, split('/'));

exports.getAuthor = compose(
  replace(/\n/g, ''),
  getGitInfo('email', (str) => '<' + str + '>'),
  getGitInfo('name', (str) => str + ' ')
);
