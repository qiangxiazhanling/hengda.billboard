import React, { useEffect, useState } from 'react'

import md5 from 'blueimp-md5'

const Sigin = () => {


  const [data, setData] = useState({
    phone: '',
    ent_name: '',
    password1: '',
    password2: ''
  })

  const [err, setErr] = useState({
    phone: '',
    ent_name: '',
    password1: '',
    password2: ''
  })

  useEffect(() => {
    sessionStorage.removeItem('auth')
  }, [])

  const handleChange = e => {
    const { value, name } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSigin = async () => {

    const errData = {}

    Object.getOwnPropertyNames(data).forEach(key => {
      if (data[key].trim() === '') {
        errData[key] = '请填写内容'
      }
    })


    if (Object.getOwnPropertyNames(errData).length !== 0) {
      setErr(errData)
      console.info(errData)
      return
    }

    if (data.password1 !== data.password2) {
      setErr(p => ({
        password1: '请确认密码',
        password2: '请确认密码'
      }))

      return
    }


    const response = await fetch(`/api/ent-user/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        phone: data.phone,
        ent_name: data.ent_name,
        password: md5(data.password1)
      })
    })
    const res = await response.json()
    if (res.message) {
      let alertFlg = false
      if (typeof res.message === 'object') {
        Object.getOwnPropertyNames(res.message)
          .forEach(key => {
            switch (key) {
              case 'phone':
                errData[key] = '该电话号已注册'
                break
              case 'ent_name':
                errData[key] = '公司名已被使用'
                break
              default:
                alertFlg = true
            }
          })
      } else {
        alertFlg = true
      }
      if (alertFlg) {
        window.alert(res.message)
      }
      setErr(errData)
      return
    } else {
      window.alert('注册成功')
      window.location = "#登录"
    }
  }


  return (
    <div className="container-fluid bg-white" style={{
      height: '100vh'
    }}>
      <div className="row px-5 border-bottom" style={{ height: '15%', minHeight: 99 }}>
        <div className="col item-middle">
          <div className="row ">
            <div className="col">
              <img className="img-fluid pull-left logo2" alt="" src={require('./components/img/logo2.png')} />
            </div>
          </div>
        </div>
        <div className="col flex-end">
          <a href="#登录" className="btn btn-primary btn-lg ">
            我要登录
          </a>
        </div>
      </div>

      <div className="row px-5 " style={{
        height: '70%',
        minHeight: '459px'
      }}>
        <div className="col mt-1" >
          <div className="card col-6 offset-3 col-lg-4 offset-lg-4 border-0">
            <div className="card-body">
              <div className="row">
                <div className="col text-center">
                  <h3>新用户注册</h3>
                </div>
              </div>
              <form>
                <div className="form-group">
                  <label>公司名称</label>
                  <input className="form-control rounded-0"
                    type="text"
                    placeholder="公司名称"
                    name="ent_name"
                    value={data.ent_name}
                    onChange={handleChange} />
                  {err.ent_name && <small className="form-text text-danger">{err.ent_name}</small>}
                </div>
                <div className="form-group">
                  <label>电话号码</label>
                  <input className="form-control rounded-0"
                    type="text"
                    placeholder="电话号码"
                    name="phone"
                    value={data.phone}
                    onChange={handleChange} />
                  {err.phone && <small className="form-text text-danger">{err.phone}</small>}
                </div>
                <div className="form-group">
                  <label>登录密码</label>
                  <input className="form-control rounded-0"
                    type="password"
                    placeholder="密码"
                    name="password1"
                    autoComplete="off"
                    value={data.password1}
                    onChange={handleChange} />
                  {err.password1 && <small className="form-text text-danger">{err.password1}</small>}
                </div>
                <div className="form-group">
                  <label>确认密码</label>
                  <input className="form-control rounded-0"
                    type="password"
                    placeholder="确认密码"
                    name="password2"
                    autoComplete="off"
                    value={data.password2}
                    onChange={handleChange} />
                  {err.password2 && <small className="form-text text-danger">{err.password2}</small>}
                </div>
              </form>
              <div className="row mt-3 px-4 ">
                <div className="col">
                  <button className="mt-2 btn btn-login rounded-0" onClick={handleSigin}>
                    注册
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row footer px-5 border-top  text-secondary" style={{
        height: '15%',
        minHeight: 99
      }}>
        <div className="col mt-4">
          <div className="row flex-center">
            <h5>版权声明: xxxxx</h5>
          </div>
          <div className="row flex-center">
            <h5>销售热线:0451-xxxxxxxx
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            客服热线:0451-xxxxxxxx</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sigin