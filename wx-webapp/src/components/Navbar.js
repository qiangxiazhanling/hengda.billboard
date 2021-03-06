import React, { useEffect, useState } from 'react'

const Navbar = props => {

  const [message, setMessage] = useState(0)

  const [offer, setOffer] = useState(0)

  const [totalFlg, setTotalFlg] = useState(true)

  useEffect(() => {
    const jobId = setInterval(() => {
      const _auth = JSON.parse(localStorage.getItem('auth'))
      if (_auth !== null) {
        fetch(`./api/message/common/total/${_auth.id}`)
          .then(res => res.json())
          .then(res => {
            if (res.content) {
              setMessage(res.content)
            } else {
              setMessage(0)
            }
          })
        fetch(`./api/offer/common/total/${_auth.id}`)
          .then(res => res.json())
          .then(res => {
            if (res.content) {
              setOffer(res.content)
            } else {
              setMessage(0)
            }
          })
      }
    }, 900000)
    return (() => window.clearInterval(jobId))
  }, [])

  useEffect(() => {
    if (totalFlg === props.totalFlg) {
      return
    }
    setTotalFlg(props.totalFlg)
    const _auth = JSON.parse(localStorage.getItem('auth'))
    if (_auth !== null && props.totalFlg) {
      fetch(`./api/message/ent/total/${_auth.id}`)
        .then(res => res.json())
        .then(res => {
          if (res.content) {
            setMessage(res.content)
          } else {
            setMessage(0)
          }
        })
    }
  }, [props, totalFlg])




  return (
    <>
      <ul className="nav bg-light nav-light fixed-bottom border-top text-center  nav-bottom justify-content-center" style={{fontSize:11}}>
        <li className="nav-item">
          <a href="#/" className={`nav-link ${props.category === '首页' ? 'text-primary' : 'text-muted'} `}>
            <i className="fa fa-fw fa-2x fa-home"></i>
            <br></br>
            首页
          </a>
        </li>

        <li className="nav-item">
          <a href="#岗位" className={`nav-link ${props.category === '岗位' ? 'text-primary' : 'text-muted'} `} >
            <i className="fa fa-fw fa-2x fa-id-card-o " aria-hidden="true"></i>
            <br></br>
            岗位
          </a>
        </li>

        <li className="nav-item">
          <a href="#校园招聘" className={`nav-link ${props.category === '校园招聘' ? 'text-primary' : 'text-muted'} `}>
            <img style={{ width: 35, height: 25 }} src="lib/img/icon.png" alt="" />
            <br></br>
            校园招聘
          </a>
        </li>
        <li className="nav-item">

          <a href="#消息" className={`nav-link ${props.category === '消息' ? 'text-primary' : 'text-muted'} `}>
            <i className="fa fa-fw fa-2x fa-envelope" aria-hidden="true"></i>
            <br></br>
            消息
            {
              (message + offer) !== 0 ? (<span className="badge badge-pill badge-danger">{message + offer}</span>) : (<></>)
            }
          </a>
        </li>
        <li className="nav-item">
          <a href="#我的" className={`nav-link ${props.category === '我的' ? 'text-primary' : 'text-muted'} `}>
            <i className="fa fa-fw fa-2x fa-user" aria-hidden="true"></i>
            <br></br>
            我的
          </a>
        </li>
      </ul>
    </>
  )
}

export default Navbar