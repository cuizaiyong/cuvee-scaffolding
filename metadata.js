const { getProjectName, getAuthor } = require('./lib/utils/index');
const metadata = {
  common: [
    {
      type: 'input',
      name: 'name',
      message: 'Project name?',
      default: getProjectName(process.cwd()),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description?',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Project author?',
      default: getAuthor(''),
    },
    {
      type: 'list',
      name: 'language',
      message: 'Which language do you want?',
      choices: ['JavaScript', 'TypeScript'],
      default: 'JavaScript',
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Which framework do you want?',
      choices: ['Vue', 'React', 'Module', 'Node'],
      default: 'Vue',
    },
    {
      type: 'confirm',
      name: 'isLint',
      message: 'Do you want to use lint?',
      default: true,
    },
  ],
  vue: [],
};

module.exports = metadata;
