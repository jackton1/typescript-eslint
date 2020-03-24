#! /usr/bin/env node

'use strict';
const minimatch = require('minimatch');
const shell = require('shelljs');

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
    console.log(`Running: \`npx eslint --config ${argv.config} --max-warnings=0 --cache\``);
  }
  const basePath = shell.pwd().toString();
  process.env.PATH += (path.delimiter + path.join(__dirname, 'node_modules', '.bin'));
  
  shell.cd(basePath);
  
  const child = shell.exec(
    `eslint --config ${path.join(basePath, argv.config)} --max-warnings=0 --cache ${fileMatches.join(" ")}`,
  {
    async: true,
    verbose
  });
  
  child.stderr.on('data', function (data) {
    console.error(data);
    shell.exit(1);
  });
}
