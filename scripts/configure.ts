#!/usr/bin/env -S npx tsx
import 'zx/globals';
import inquirer from 'inquirer';
import ejs from 'ejs';

const defaultValues = {
  githubRepo: 'my-github-repo',
  githubOrg: 'my-github-org',
  domain: 'myapp.com',
  fromEmail: 'noreply@myapp.com',
  awsAccount: '428245413678',
  awsRegion: 'eu-central-1',
  environments: {
    staging: {
      subdomain: 'staging',
      publicDatabase: true,
    },
    subdomain: {
      subdomain: '',
      publicDatabase: true,
    },
  },
};

const defaultQuestions = [
  {
    type: 'string',
    name: 'name',
    message: 'What would you like to call your project?',
    default: 'my-project',
  },
  {
    type: 'string',
    name: 'githubOrg',
    message: 'Enter your GitHub username or organization name',
  },
  {
    type: 'string',
    name: 'githubRepo',
    message: 'Enter your GitHub repository name',
  },
  {
    type: 'string',
    name: 'domain',
    message: 'Enter the domain you want to use for your project',
    default: 'my-project.com',
  },
  {
    type: 'string',
    name: 'fromEmail',
    message: 'What email should be used as the "from" address when sending emails to your customers?',
    default: 'noreply@example.com',
  },
  {
    type: 'string',
    name: 'awsAccount',
    message: 'What is your AWS account number?',
    default: '000000000000',
  },
  {
    type: 'string',
    name: 'awsRegion',
    message: 'Which AWS region would you like to deploy to? Pick the one closest to your end users.',
    default: 'us-east-1',
  },
];

const run = async () => {
  const defaultAnswers = await inquirer.prompt(defaultQuestions);

  defaultAnswers.environments = {};

  for (const env of ['staging', 'production']) {
    const environmentAnswers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'publicDatabase',
        message: `Should the database be publicly available in ${env}? Not recommended for production environments with real customer data. Setting this to false will deploy additional infrastructure that will cost ~$30 per month.`,
        default: env !== 'production',
      },
    ]);
    defaultAnswers.environments[env] = environmentAnswers;
  }

  console.log('Generating config...');

  const volcaConfigContent = await ejs.renderFile(path.join(__dirname, '../templates/config.ejs'), {
    ...defaultValues,
    ...defaultAnswers,
  });
  fs.writeFileSync(path.join(__dirname, '../app.config.ts'), volcaConfigContent);

  console.log('Done!');
};

console.log("Welcome to Volca! Let's configure your project.");

run();
