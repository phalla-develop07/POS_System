const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const imageMap = {
  4: 'https://picsum.photos/seed/skin1004a/600/450',
  5: 'https://picsum.photos/seed/skin1004b/600/450',
  6: 'https://picsum.photos/seed/cetaphil/600/450',
  7: 'https://picsum.photos/seed/cerave/600/450',
  8: 'https://picsum.photos/seed/larocheposay/600/450',
  9: 'https://picsum.photos/seed/ordinaryserum/600/450'
};

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartpos_system'
  });

  const [before] = await conn.query('SELECT id, name, image_url FROM products ORDER BY id');
  console.log('BEFORE:', before);

  for (const [id, url] of Object.entries(imageMap)) {
    await conn.query('UPDATE products SET image_url = ? WHERE id = ?', [url, Number(id)]);
  }

  const [after] = await conn.query('SELECT id, name, image_url FROM products ORDER BY id');
  console.log('AFTER:', after);

  await conn.end();
})().catch((err) => {
  console.error('Image update failed:', err.message);
  process.exit(1);
});
