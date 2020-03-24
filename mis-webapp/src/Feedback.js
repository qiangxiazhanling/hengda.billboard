import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import moment from 'moment'

import { Title, Navbar } from './Components'

export default function FeedbackRouter() {
  useEffect(() => {
    const auth = sessionStorage.getItem('mis-auth')
    if (!!!auth) {
      window.location = '#登录'
    }
  }, [])

  return (
    <Router>
      <Switch>
        <Route path="/投诉及反馈/投诉"><Complaint /></Route>
        <Route path="/投诉及反馈/意见反馈"><Feedback /></Route>
      </Switch>
    </Router>
  )
}

function SideNav(props) {
  return (
    <div className="list-group">
      <h6 className="text-muted">
        <strong>选择功能</strong>
      </h6>

      <div>
        <a href="#投诉及反馈/投诉"
          className={`text-small list-group-item list-group-item-action ${props.category === '投诉' ? 'active' : ''}`}
        >
          投诉
          <span className="pull-right">
            <i className="fa fa-fw fa-angle-right"></i>
          </span>
        </a>

        <a href="#投诉及反馈/意见反馈"
          className={`text-small list-group-item list-group-item-action ${props.category === '意见反馈' ? 'active' : ''}`}
        >
          意见反馈
          <span className="pull-right">
            <i className="fa fa-fw fa-angle-right"></i>
          </span>
        </a>
      </div>
    </div>
  )
}

function Complaint() {
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      const response = await window.fetch(`/api/feedback/complaint/`)
      const res = await response.json()
      if (res.message) {
        window.console.error(res.message)
        return
      }
      setData(res.content)
    })()
  }, [])

  const handleReply = async event => {
    const content = window.prompt('对投诉回复的内容')
    const response = await window.fetch(`/api/feedback/complaint/reply`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: event.target.getAttribute('data-id'),
        user_id: event.target.getAttribute('data-user-id'),
        category: '系统消息',
        title: '对用户投诉内容的回复',
        content: content,
        datime: moment().format('YYYY-MM-DD')
      })
    })
    const res = await response.json()
    if (res.message) {
      window.alert(res.message)
      return
    }
    window.location.reload(true)
  }

  return (
    <>
      <Title />
      <Navbar category="投诉及反馈" />

      <div className="container-fluid mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav category="投诉" />
          </div>

          <div className="col-9 col-lg-10">
            <h3>投诉</h3>
            <hr />

            <div className="card shadow">
              <div className="card-body">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>用户</th>
                      <th>日期</th>
                      <th>内容</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      data.map(it => (
                        <tr key={it.id}>
                          <td>{it.id}</td>
                          <td>
                            <span className="badge badge-info">{it.user_category}</span>
                            {it.name}
                            ({it.username})
                          </td>
                          <td>{it.datime}</td>
                          <td>{it.content}</td>
                          <td className="text-right">
                            <button type="button" className="btn btn-outline-success btn-sm"
                              data-id={it.id} data-user-id={it.user_id}
                              onClick={handleReply}
                            >
                              <i className="fa fa-fw fa-reply" data-id={it.id} data-user-id={it.user_id}></i>
                              回复
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Feedback() {
  const [data, setData] = useState([])

  useEffect(() => {
    ;(async () => {
      const response = await window.fetch(`/api/feedback/feedback/`)
      const res = await response.json()
      if (res.message) {
        window.console.error(res.message)
        return
      }
      setData(res.content)
    })()
  }, [])

  const handleReply = async event => {
    const content = window.prompt('对用户意见反馈内容的回复')
    const response = await window.fetch(`/api/feedback/feedback/reply`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: event.target.getAttribute('data-id'),
        user_id: event.target.getAttribute('data-user-id'),
        category: '系统消息',
        title: '对用户意见反馈内容的回复',
        content: content,
        datime: moment().format('YYYY-MM-DD')
      })
    })
    const res = await response.json()
    if (res.message) {
      window.alert(res.message)
      return
    }
    window.location.reload(true)
  }

  return (
    <>
      <Title />
      <Navbar category="投诉及反馈" />

      <div className="container-fluid mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav category="意见反馈" />
          </div>

          <div className="col-9 col-lg-10">
            <h3>意见反馈</h3>
            <hr />

            <div className="card shadow">
              <div className="card-body">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>用户</th>
                      <th>日期</th>
                      <th>内容</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      data.map(it => (
                        <tr key={it.id}>
                          <td>{it.id}</td>
                          <td>
                            <span className="badge badge-info">{it.user_category}</span>
                            {it.name}
                            ({it.username})
                          </td>
                          <td>{it.datime}</td>
                          <td>{it.content}</td>
                          <td className="text-right">
                            <button type="button" className="btn btn-outline-success btn-sm"
                              data-id={it.id} data-user-id={it.user_id}
                              onClick={handleReply}
                            >
                              <i className="fa fa-fw fa-reply" data-id={it.id} data-user-id={it.user_id}></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
