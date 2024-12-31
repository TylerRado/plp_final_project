const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.register = (req, res) => {
    console.log(req.body);

 const {name, email, password, passwordConfirm} = req.body;

 db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if(error){
        console.log(error)
    }

    if(results.length > 0){
        return res.render('register', {
            message: 'Email already exist'
        })
    } else if(password !== passwordConfirm){
        return res.render('register', {
            message: 'Password do not match'   
        });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    db.query('INSERT INTO users SET ?', {name: name, email: email, password: password },(error,results) =>{
        if(error) {
            console.log(error);
        }else{
            console.log(results);
            return res.render('register',{
                message: 'user registered'
            })
        }

    })


  });
}

// exports.loging = (req, res) => {
//     console.log(req.body);

//     const {email, password,} = req.body;
    
//     db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
//         if(error){
//             console.log(error)
//         }
    
//         if(results.length > 0){
//             return res.render('loging', {
//                 message: 'User not found! Please register.'
//             })
        
// }

exports.loging = (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render('loging', {
            message: 'Please provide an email and password'
        });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Server error');
        }

        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).render('loging', {
                message: 'Email or Password is incorrect'
            });
        }

        const id = results[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        console.log('Token:', token);

        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };

        res.cookie('jwt', token, cookieOptions);
        return res.status(200).redirect('/dashboard');
    });
};
