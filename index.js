const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post('/api/airdrop', async (req, res) => {
  const { solanaAddress, twitterHandle, telegramHandle } = req.body;

  if (!solanaAddress || !twitterHandle || !telegramHandle) {
    return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
  }

  try {
    const exists = await pool.query(
      'SELECT * FROM submissions WHERE solana_address = $1',
      [solanaAddress]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Ten adres już został zgłoszony.' });
    }

    await pool.query(
      'INSERT INTO submissions (solana_address, twitter_handle, telegram_handle) VALUES ($1, $2, $3)',
      [solanaAddress, twitterHandle, telegramHandle]
    );

    res.status(200).json({ message: 'Zgłoszenie przyjęte!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd serwera.' });
  }
});

app.listen(port, () => {
  console.log(`API działa na porcie ${port}`);
});
