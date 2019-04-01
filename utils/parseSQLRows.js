parseSQLRows = (rows) => {
  return JSON.parse(JSON.stringify(rows));
};

module.exports = parseSQLRows;