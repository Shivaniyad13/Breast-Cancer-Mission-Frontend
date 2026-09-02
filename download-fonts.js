const fs = require('fs');
const path = require('path');
const https = require('https');

const fontsDir = path.join(__dirname, 'public', 'fonts');

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fonts = [
  {
    name: 'Roboto-Regular.ttf',
    url: 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf'
  },
  {
    name: 'Roboto-Bold.ttf',
    url: 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Bold.ttf'
  },
  {
    name: 'Roboto-Italic.ttf',
    url: 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Italic.ttf'
  },
  {
    name: 'Roboto-BoldItalic.ttf',
    url: 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-BoldItalic.ttf'
  }
];

function downloadFont(font) {
  return new Promise((resolve, reject) => {
    const dest = path.join(fontsDir, font.name);
    console.log(`Downloading ${font.name} from ${font.url}...`);
    
    const file = fs.createWriteStream(dest);
    
    https.get(font.url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${font.name}: Status code ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded and saved ${font.name}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Clean up file on error
      reject(err);
    });
  });
}

async function run() {
  try {
    for (const font of fonts) {
      await downloadFont(font);
    }
    console.log('All fonts downloaded successfully!');
  } catch (error) {
    console.error('Error downloading fonts:', error);
    process.exit(1);
  }
}

run();
