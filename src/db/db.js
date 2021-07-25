const mongoose = require("mongoose");
const port = 27017;

mongoose.connect(process.env.SECRET_MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log(`mongoose port is ${port}`))
    .catch((error) => console.log(error));