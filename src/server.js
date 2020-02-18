const express = require('express')
const app = express(); // conexão com express
const Pool = require('pg').Pool // Pool vai manter a conexão ativa

//conecction

const db = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'Doe'
})


//configurando para que mostre o restante dos arquivos estáticos
app.use(express.static('public'))

//habilitando body do formulario
app.use(express.urlencoded({ extended: true }))

// Configurações de template engine
const nunjucks = require('nunjucks')
    nunjucks.configure("./", {
        express: app,
        noCache: true 
    }) // 1 parametro === caminho do index.html


// lista de doadores

// Configurações de exibição na página
app.get('/', (req, res) =>{
    db.query("SELECT * FROM doadores", (err, result) =>{
        if(err) return res.send("Erro no banco de dados!")
        const doadores = result.rows
        return res.render('index.html', { doadores })
    })
})
app.post('/', (req, res) =>{
    //pegar dados do formulario
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;
    if(name === "" || email === "" || blood === "" ){
        return res.send('Todos os campos são obrigatórios')
    }
        //inserindo dados na tabela
    const query = `INSERT INTO doadores ("name", "email", "blood") VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    //banco de dados
    db.query(query, values, (err) =>{
        if (err) return res.send("Erro no banco de dados!")
            return res.redirect('/')
    })
    
    
})

app.listen(2000, 
    console.log('Rodando na porta 2000'))