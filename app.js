if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require("./models/campground");
const Review = require("./models/review");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash')
const session = require('express-session');
const {campgroundSchema, reviewSchema} = require("./schemas")
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');
const User = require('./models/user');
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db =  mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
}

) 

const app = express();
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 *7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', usersRoutes);

app.use('/campgrounds',campgroundsRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)

app.get('/', (req,res) =>{
    res.render('home')
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found', 404))
})


app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh no, Something went wrong!';
    res.status(statusCode).render('error',{err})

})

app.listen(3000,()=> {
    console.log('Serving on port 3000')
})