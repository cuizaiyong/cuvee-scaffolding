const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ejs = require('ejs');

// 1、处理交互
// 2、生成模板

inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name?',
    },
  ])
  .then(answers => {
    console.log(answers);
    // 根据用户回答的结果生成文件

    // 模板目录
    const tmplDir = path.join(__dirname, '..', 'templates');

    // 目标目录
    const destDir = process.cwd();

    // 将模板下的文件全部转换到目标目录
    fs.readdir(tmplDir, (err, files) => {
      // console.log(file);
      if (err) throw err;
      files.forEach(file => {
        ejs.renderFile(path.join(tmplDir, file), answers, (err, result) => {
          if (err) throw err;

          // 将结果写入目标文件路径
          fs.writeFileSync(path.join(destDir, file), result);
        });
      });
    });
  });
