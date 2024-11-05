const { Sequelize } = require("sequelize");

const database = new Sequelize('postgres','postgres.vfhwgszkeonobfxcbxdj','S@mnang2024',{
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 6543, 
    dialect: 'postgres'
})

module.exports = database;