#! /usr/bin/env node

'use strict';
const minimatch = require('minimatch');
const shell = require('shelljs');
const path = require('path');

const argv = require('yargs')
  .option(
    'config',
    {
      alias: 'c',
      required: true,
      type: 'string',
      description: 'Config file'
    },
  )
  .option(
    'extensions',
    {
      alias: 'ext',
      required: false,
      default: 'ts,tsx',
      type: 'string',
      description: 'Comma separated file extensions i.e -ext \'ts,tsx,js,jsx\''
    },
  )
  .option(
    'verbose',
    {
      alias: 'v',
      default: false,
      type: 'boolean',
      description: 'Turn on/off verbose output'
    },
  )
  .command(
    '$0 [filenames..]',
    'Runs typescript-eslint based on changes to the provided extension files',
  )
  .help()
  .argv;

const {filenames = [], verbose = false} = argv;
const extensions = argv.extensions.split(',').join('|');
const fileMatches = filenames.filter(
  minimatch.filter(`*.+({${extensions})`, {matchBase: true}),
);
const shouldExecute = fileMatches.length > 0;

if (!shouldExecute) {
  if (verbose) {
    console.log('No matching files found requires: js(x)|ts(x)');
  }
  return 0;
} else {
  if (verbose) {
    console.log(`Matching files found: ${fileMatches.join(", ")}`);
  }
  const basePath = shell.pwd().toString();
  const oldPwd = path.join(__dirname, '..');
  const eslint = path.join(oldPwd, 'node_modules', '.bin', 'eslint');
  const command = `
    ${eslint} --config ${path.join(basePath, argv.config)} \
    --resolve-plugins-relative-to ${oldPwd} --max-warnings=0 ${fileMatches.join(" ")}
  `;
  
  shell.cd(basePath);
  
  if (verbose) {
    console.log(command);
  }
  
  const child = shell.exec(command, {
    async: true,
    verbose
  });
  
  child.stderr.on('data', function (data) {
    console.error(data);
    shell.exit(1);
  });
}
