export default {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
  verbose: true,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: ["node_modules/(?!(mysql2|bcryptjs|jsonwebtoken)/)"],
};
