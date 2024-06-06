const dotenv = require('dotenv');
dotenv.config(); 
/*
const Pool = require('pg').Pool; 

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS, 
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT, 
    database: process.env.DB_DB
}); 

module.exports = pool; 
*/
const { createClient } = require('@supabase/supabase-js');
const supabaseURL = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseURL, supabaseServiceKey);

module.exports = supabase;