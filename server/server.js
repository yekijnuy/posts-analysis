const express = require('express');
const cors = require('cors');
const { generateZipForPath_JSON, generateZipForPath_CSV } = require('../service_agent/generateZipForPath.js');

// initialization
const app = express();
const port = 3001;

app.use(cors());

app.get('/health', (req, res) => {
    res.status(200).send('Hi Cafemedia! We are healthy');
});

app.get('/postdata/:jsonflag/:detailmode', async (req, res) => {
    const jsonflag = req.params.jsonflag;
    const detailmode = req.params.detailmode;

    console.log('Flags: ', jsonflag, detailmode);
    let spawn = require('child_process').spawn;
    let process = spawn('python', ['../service_agent/postsaggregator.py', jsonflag, detailmode]);
    let output = [];

    process.stdout.on('data', (data) => {
        console.log('Working on child data');
        output.push(data);
    });
    process.stdout.on('error', () => {
        console.log('Failed to start child');
    });
    process.stdout.on('end', async () => {
        console.log('Finished collecting data chunks');
        let zipWork = null;
        if (jsonflag === 'true') {
            zipWork = await generateZipForPath_JSON('../output_posts');
        } else {
            zipWork = await generateZipForPath_CSV('../output_posts');
        }
        res.status(200).send(zipWork);
    });
    process.stdout.on('close', (code) => {
        console.log('Child process exited with code ' + code);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
