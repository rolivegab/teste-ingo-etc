import Express from 'express'
import {Pool} from 'pg'
import {config} from 'dotenv'  

// Carrega as variáveis de ambiente do .env no process.env do node
config()

// Cria uma pool do postgresql, que vai servir como uma conexão que vai ficar sempre aberta
// onde será possível executar comandos do SQL
const pool = new Pool()

const app = Express()

app.listen(3001, () => {
    console.log(`A aplicação está escutando na porta ${3001}`)
})

app.get('/registrar', async (req, res) => {
    const {username, password} = req.query

    try {
        const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password])
        res.send(`Usuário <b>${username}</b> inserido com sucesso.`)
    } catch (e) {
        res.json(e)
    }
})

app.get('/usuarios', async (req, res) => {
    const result = await pool.query('SELECT * FROM users')
    const table = `<table style="border: 1px solid black; padding: 5px;">
        <tr>
            <th>Usuário</th>
            <th>Senha</th>
        </tr>
        ${result.rows.map(i => `<tr>
            <td style="border: 1px solid black; padding: 5px;">${i.username}</td>
            <td style="border: 1px solid black; padding: 5px;">${i.password}</td>
        </tr>`).join('')}
    </table>`

    res.send(table)
})

app.get('/configurar', async (req, res) => {
    const result = await pool.query('CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL)')
    res.send(result)
})