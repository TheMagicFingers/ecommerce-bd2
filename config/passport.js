// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id_cliente, done) {
        connection.query("SELECT * FROM clientes WHERE id_cliente = ? ",[id_cliente], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query(`SELECT * FROM clientes WHERE email_user = '${email}' `, function(err, resultSelect) {
                if (err)
                    console.log(err)
                //Se retornar um tupla vazia
                if (resultSelect.length) {
                    console.log("Email já inserido")
                    return done(null, false, req.flash('signupMessage', 'Nome de usuário já em uso.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    let newUserMysql = {
                        nome_user: req.body.username,
                        senha_user: bcrypt.hashSync(password, null, null),
                        email: email
                         // use the generateHash function in our user model
                    };

                    let endereco = {
                            rua: req.body.rua,
                            logradouro: req.body.logradouro,
                            bairro : req.body.bairro,
                            estado: req.body.estado,
                            numero: req.body.numero,
                            cidade: req.body.cidade
                    };
                    
                    console.log("User :");
                    console.log(newUserMysql);

                    connection.query(`call insert_user('${newUserMysql.nome_user}','${newUserMysql.senha_user}','${newUserMysql.email}','${endereco.rua}',
                    '${endereco.cidade}','${endereco.logradouro}','${endereco.numero}','${endereco.bairro}','${endereco.estado}')`,
                    function(err, resultInsert) {
                        if(err) console.log(err);
                        console.log(resultInsert);
                        //console.log("1   " + resultInsert[0].RowDataPacket.id)
                        //console.log("2   " + resultInsert[0].id);
                        //console.log("3   " +resultInsert.id);


                    newUserMysql.id = resultInsert.id;

                    return done(null, newUserMysql);  
                    });    
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
