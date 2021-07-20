module.exports = {
    "all": true, // include all source files even though the haven't been touched by any tests
    "extension": [".ts", ".tsx"],
    "reporter": ["lcov", "text-summary"],
    "include": ["src/**"],
    "exclude": ["src/**/*.test.ts"],
    "report-dir": "./test-results/coverage"
}