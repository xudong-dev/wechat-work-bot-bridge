require("dotenv/config");

// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-unresolved
const { NamingStrategy } = require("./dist/common/naming.strategy");

const { DATABASE_URL, DATABASE_SSL } = process.env;

module.exports = {
  type: "postgres",
  url: DATABASE_URL,
  timezone: "Z",
  ...(DATABASE_SSL === "true"
    ? {
        extra: {
          ssl: true
        }
      }
    : {}),
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true,
  namingStrategy: new NamingStrategy()
};
