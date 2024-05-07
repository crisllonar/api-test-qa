const express = require('express');
const v1PersonRouter = require('./v1/routes/personRoutes');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api/v1/person", v1PersonRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});