const express = require('express');
const fileUpload = require('express-fileupload');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(fileUpload());

const KEYFILEPATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const auth = new google.auth.GoogleAuth({ keyFile: KEYFILEPATH, scopes: SCOPES });
const drive = google.drive({ version: 'v3', auth });

const FOLDER_ID = '1tOMPi7-mWwPJTBJioaxugDeT5Uo47MH_';

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No se subió ninguna imagen');
  }

  const imageFile = req.files.image;

  try {
    const response = await drive.files.create({
      requestBody: {
        name: imageFile.name,
        mimeType: imageFile.mimetype,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: imageFile.mimetype,
        body: imageFile.data,
      },
    });

    res.json({ fileId: response.data.id });
  } catch (err) {
    console.error('Error al subir a Drive:', err);
    res.status(500).send('Error al subir la imagen');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
