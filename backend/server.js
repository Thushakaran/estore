const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');
const https = require('https');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, 'config/config.env') });

connectDatabase();

const PORT = process.env.PORT || 5000;

// Check if we're in production and HTTPS certificates exist
if (process.env.NODE_ENV === 'production') {
    const httpsOptions = {
        key: fs.readFileSync(process.env.HTTPS_KEY_PATH || './ssl/private.key'),
        cert: fs.readFileSync(process.env.HTTPS_CERT_PATH || './ssl/certificate.crt')
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`HTTPS Server listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
} else {
    app.listen(PORT, () => {
        console.log(`HTTP Server listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
}