const db = require('./mariadb');


async function getTables(){
    const query = await db.run("select * from mytable");
    resizeBy.send(query)
}

async function getData(){
    await database.run(`INSERT INTO memos (content) VALUES (?)`, [req.body.content]);
    const result = await database.run("SELECT * FROM memos");
    resizeBy.send(query)
}

async function getData3(){
    await database.run(`UPDATE memos SET content = ? WHERE id = ?`, [req.body.content, req.params.id]);
    const result = await database.run("SELECT * FROM memos");
    res.send(result);
}

