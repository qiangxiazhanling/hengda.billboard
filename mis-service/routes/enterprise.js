const Router = require('@koa/router')

const mysql = require('../mysql')

const router = new Router({
  prefix: '/api/enterprise'
})

module.exports = router

router
  .get('/', async ctx => {
    const sql = `
      select *
      from enterprise
      order by id desc
      limit 200
    `
    const pool = mysql.promise()
    try {
      const [rows, fields] = await pool.query(sql)
      ctx.response.body = { message: '', content: rows}
    } catch (err) {
      console.error(err)
      ctx.response.body = { message: '服务器错误', content: '' }
    }
  })