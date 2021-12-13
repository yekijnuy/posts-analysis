const JSZip = require('jszip');
const fs = require('fs');

// TODO: need to fix - is causing errors
const addFilesFromDirectoryToZip = (directoryPath = '', zip) => {
    const directoryContents = fs.readdirSync(directoryPath, {
        withFileTypes: true,
    });

    directoryContents.forEach(({ name }) => {
        const path = `${directoryPath}/${name}`;

        // if file then add
        if (fs.statSync(path).isFile()) {
            zip.file(path, fs.readFileSync(path, 'utf8'));
        }

        // recursive call for subfolders
        if (fs.statSync(path).isDirectory()) {
            addFilesFromDirectoryToZip(path, zip);
        }
    });
};

// helps with pathing and creating zip in memory
const generateZipForPath_JSON = async (directoryPath = '') => {
    const zip = new JSZip();
    // in memory, could utilize fs.writeFileSync() for writing
    zip.file('README.md', 'I need to be updated badly');
    zip.file('daily_top_posts.json', fs.readFileSync(`${directoryPath}/daily_top_posts.json`));
    zip.file('other_posts.json', fs.readFileSync(`${directoryPath}/other_posts.json`));
    zip.file('top_posts.json', fs.readFileSync(`${directoryPath}/top_posts.json`));
    // addFilesFromDirectoryToZip(directoryPath, zip);
    const zipAsBase64 = await zip.generateAsync({ type: 'base64' });
    fs.writeFileSync('test_check.zip', zipAsBase64);
    return zipAsBase64;
};

// helps with pathing and creating zip in memory
const generateZipForPath_CSV = async (directoryPath = '') => {
    const zip = new JSZip();
    // in memory, could utilize fs.writeFileSync() for writing
    zip.file('README.md', 'I need to be updated badly');
    zip.file('daily_top_posts.csv', fs.readFileSync(`${directoryPath}/daily_top_posts.csv`));
    zip.file('other_posts.csv', fs.readFileSync(`${directoryPath}/other_posts.csv`));
    zip.file('top_posts.csv', fs.readFileSync(`${directoryPath}/top_posts.csv`));
    // addFilesFromDirectoryToZip(directoryPath, zip);
    const zipAsBase64 = await zip.generateAsync({ type: 'base64' });
    fs.writeFileSync('test_check.zip', zipAsBase64);
    return zipAsBase64;
};
module.exports = { generateZipForPath_JSON, generateZipForPath_CSV };
