import React, { useState, useEffect } from 'react'

import { View } from './Components'

const Edit = () => {

  const [list, setList] = useState([])

  useEffect(() => {
    const _auth = JSON.parse(sessionStorage.getItem('auth'))

    fetch(`./api/journal/edit/企业用户/${_auth.id}`)
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          window.alert(res.message)
        } else {
          setList(res.content)
        }
      })
  }, [])

  return (
    <View category="操作">
      <div className="row bg-white shadow" >
        <div className="col card rounded-0">
          <div className="card-body">
            <h3 className="pull-left">操作记录</h3>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">操作时间</th>
                  <th scope="col">操作类型</th>
                  <th scope="col">备注</th>
                </tr>
              </thead>
              <tbody>
                {
                  list && list.map((item, inx) => (
                    <tr key={inx}>
                      <td>{item.datime}</td>
                      <td>{item.category2}</td>
                      <td>{item.remark}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </View>
  )

}

export default Edit