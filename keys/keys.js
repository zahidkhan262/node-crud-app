module.exports = {
    MONGOURI: 'mongodb+srv://zahidkhan262:vnxALyOCP97iwkh6@cluster0.qs4sz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

}


mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.adv0t.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
