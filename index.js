const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000; // Use environment port or 3000 as default
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; 
