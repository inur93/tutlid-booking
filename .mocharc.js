module.exports = {
    type: "module",
    //rules and behaviour
    jobs:01, // 4,
    parallel: false, //true,
    ui: "bdd",

    //reporting and output
    diff: true,
    fullTrace: true,
    inlineDiffs: true,
    reporter: "mocha-junit-reporter", //"spec",
    reporterOptions: [
        "mochaFile=./test-results/junit/test-results.xml",
        "rootSuiteTitle=Server Tests"
    ],

    //file handling
    extension: [".ts", ".js"],
    watchFiles: "**/*.ts",
    //ignore: "./tests/**/*",
    recursive: true,
    require: "ts-node/register"
}