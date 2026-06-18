#!/usr/bin/env node

function parseArgs(argv) {
    if (argv.length < 1) {
        printUsageAndExit();
    }

    let name = 'world';

    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];
        if (token === '--name') {
            name = argv[i + 1] || 'world';
            i += 1;
            continue;
        }
        if (token === '--help' || token === '-h') {
            printUsageAndExit();
        }
        throw new Error(`未知参数: ${token}`);
    }

  return { name };
}

function printUsageAndExit() {
    console.log('用法: node scripts/hello.mjs --name <your-name>');
    process.exit(0);
}

function main() {
    const { name } = parseArgs(process.argv.slice(2));
    console.log(`Hello, ${name}!`);
}

main();
