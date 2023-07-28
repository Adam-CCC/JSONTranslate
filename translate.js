const fs = require('fs');
const axios = require('axios');

// Ваш IAM-токен от Yandex Cloud
const IAM_TOKEN = 't1.9euelZqOl5SSk5jNmMqMz8uOl56Tju3rnpWaz5rJmZuPlYrHm5CMjYyKm4rl8_dVO3FZ-e9QRTBd_t3z9xVqbln571BFMF3-zef1656VmpyTmpDHx5aXzpPKz8vIy5bH7_zF656VmpyTmpDHx5aXzpPKz8vIy5bH.T5pT3O9CfJiUrAHqMvG1a2XfetxBd9dsk1ZY-FyusfDKC5z4x-tBgr1MoazxEK0m458fF-hthxcNo9bIzXhpBw';

// Функция для отправки запроса к Yandex Translate API
async function translateTexts(texts, targetLanguage, folderId) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${IAM_TOKEN}`
  };

  const body = {
    targetLanguageCode: targetLanguage,
    texts,
    folderId
  };

  try {
    const response = await axios.post('https://translate.api.cloud.yandex.net/translate/v2/translate', body, { headers });
    return response.data.translations.map(translation => translation.text);
  } catch (error) {
    console.error('Translation error:', error.message);
    return [];
  }
}

// Функция для чтения JSON-файла и перевода слов
async function translateFromFile(filename, targetLanguage, folderId) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    const json = JSON.parse(data);
    const texts = Object.values(json);

    const translatedTexts = await translateTexts(texts, targetLanguage, folderId);

    const translatedJson = {};
    Object.keys(json).forEach((key, index) => {
      translatedJson[key] = translatedTexts[index];
    });

    console.log('Original JSON:', json);
    console.log('Translated JSON:', translatedJson);
  } catch (error) {
    console.error('Error reading or processing file:', error.message);
  }
}

// Передайте имя вашего JSON-файла, язык перевода и folder_id в качестве аргументов командной строки
const filename = process.argv[2];
const targetLanguage = 'ru'; // Язык перевода, в данном случае, русский
const folderId = 'b1g2jfsjctrmjmpl626g'; // Замените на ваш реальный folder_id

if (filename) {
  translateFromFile(filename, targetLanguage, folderId);
} else {
  console.error('Please provide the JSON file name as an argument.');
}
