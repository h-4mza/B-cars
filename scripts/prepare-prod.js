const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

schema = schema.replace(
  /provider = "sqlite"/,
  'provider = "postgresql"'
);

schema = schema.replace(
  /url\s*=\s*"file:\.\/dev\.db"/,
  'url      = env("DATABASE_URL")'
);

fs.writeFileSync(schemaPath, schema);
console.log('Prisma schema updated for production (PostgreSQL).');
