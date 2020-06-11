class Scaffolding {
  constructor() {
    this.path = require('path');
    this.fs = require('fs');
    this.inquirer = require('inquirer');
    this.git = require('simple-git')();
    this.ejs = require('ejs');
    this.ora = require('ora');
    this.answers = {};
    this.metadata = require('../metadata');
    this.tmpDir = this.path.join(__dirname, '..', 'templates');
    this.destDir = process.cwd();
    this.templateDir = process.env.HOME + '/.cuvee';
    this.gitUrl = {
      Vue: 'https://github.com/cuizaiyong/vue-template.git',
    };
  }
  async init() {
    // 用户交互
    await this._interaction();
    // 处理模板
    await this._handleTmp();
  }
  async _interaction() {
    this.answers = await this.inquirer.prompt(this.metadata.common);
  }
  async _handleTmp() {
    const { framework } = this.answers;
    // 创建目录
    await this._makeDir();

    const spinner = this.ora('downloading template...').start();
    await this.git.clone(this.gitUrl[framework], this.templateDir);
    spinner.stop();
    this._writeFile(this.templateDir);
    await this.git.init(this.destDir);
  }
  _writeFile(path) {
    const files = this.fs.readdirSync(path);
    files.forEach((file) => {
      const curPath = path + '/' + file;
      if (curPath.includes('/.git/')) {
        // @todo
      } else {
        const suffixPath = curPath.replace(this.templateDir, '');
        if (this.fs.statSync(curPath).isDirectory()) {
          this.fs.mkdirSync(this.destDir + suffixPath);
          this._writeFile(curPath);
        } else {
          this.ejs.renderFile(curPath, this.answers, (err, result) => {
            if (err) throw err;
            const suffixPath = curPath.replace(this.templateDir, '');
            this.fs.writeFileSync(this.destDir + suffixPath, result);
          });
        }
      }
    });
  }
  async _makeDir() {
    await this._delDir(this.templateDir);
    this.fs.mkdirSync(this.templateDir);
  }
  async _delDir(path) {
    let files = [];
    if (this.fs.existsSync(path)) {
      const files = this.fs.readdirSync(path);
      files.forEach((file) => {
        const curPath = path + '/' + file;
        if (this.fs.statSync(curPath).isDirectory()) {
          this._delDir(curPath);
        } else {
          this.fs.unlinkSync(curPath);
        }
      });
      this.fs.rmdirSync(path);
    }
  }
}

new Scaffolding().init();
