import React, { useEffect, useState } from 'react'

import { useParams, useLocation } from 'react-router-dom'

import Modal from '../components/Modal'
import { View, ResumeView } from './Components'
import { SelectField } from '../components/InputField'
import { EditJournal } from '../commonFetch'
import moment from 'moment'


export const SearchFavorite = body => new Promise((resolve, reject) => {
  fetch(`./api/favorite/search/one/`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(response => resolve(response))
    .catch(err => reject(err))
})

const ResumeDetalis = () => {

  const { id, category } = useParams()

  const { search } = useLocation()

  const [data, setData] = useState({})

  const [favorite, setFavorite] = useState(false)

  const [auth, setAuth] = useState(0)

  const [modalShow1, setModalShow1] = useState(false)

  const [modalShow2, setModalShow2] = useState(false)

  const [recruitmentList, setRecruitmentList] = useState([])

  const [entStatus, setEntStatus] = useState(false)


  useEffect(() => {
    const _auth = JSON.parse(sessionStorage.getItem('auth'))
    if (_auth === null) {
      window.location = '#登录'
    } else {
      setAuth(_auth)
      fetch(`./api/enterprise/check/${_auth.enterprise_id}?uuid=${_auth.enterprise_uuid}`)
        .then(res => res.json())
        .then(res => {
          if (res.message) {
            window.alert(res.message)
          } else {
            setEntStatus(res.content)
          }
        })
      fetch(`./api/resume/${id}${search}&u_i=${_auth.id}&user_uuid=${_auth.uuid}`)
        .then(res => res.json())
        .then(res => {
          if (res.content) {
            setData(p => res.content)
          } else {
            window.alert(res.message)
          }
        })
      SearchFavorite({
        user_id: _auth.id,
        data_id: id,
        category1: '企业用户',
        category2: '简历',
      }).then(res => {
        if (res.content) {
          setFavorite(p => res.content)
        }
      })
      fetch(`./api/recruitment/enterprise/${_auth.enterprise_id}?u_id=${_auth.uuid}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          status: '在招'
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.message) {
            window.alert(res.message)
          } else {
            setRecruitmentList(res.content)
          }
        })
    }
  }, [id, search])

  const handleFavorite = () => {
    if (favorite) {
      fetch(`./api/favorite/${favorite.id}/`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(res => {
          if (res.message === '') {
            setFavorite(false)
          } else {
            alert(res.message)
          }
        })
    } else {
      fetch(`./api/favorite/`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          user_id: auth.id,
          data_id: data.id,
          category1: '企业用户',
          category2: '简历',
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.message === '') {
            SearchFavorite({
              user_id: auth.id,
              data_id: id,
              category1: '企业用户',
              category2: '简历',
            }).then(res1 => {
              if (res1.content) {
                setFavorite(p => res1.content)
              }
            })
          } else {
            alert(res.message)
          }
        })
    }
  }

  const handleInvite = () => {


    fetch(`./api/offer/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        recruitment_id: document.getElementById('recruitment').value,
        common_user_id: data.common_user_id,
        address: document.getElementById('address').value,
        phone1: document.getElementById('phone1').value,
        phone2: document.getElementById('phone2').value,
        luxian: document.getElementById('luxian').value,
        mianshishijian: document.getElementById('datime').value,
        remark: document.getElementById('remark').value
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.content) {
          window.alert('已发出面试邀请,请到消息确认')
          EditJournal({
            category2: '简历',
            data_id: data.id,
            remark: `邀请<${data.name}面试>`
          }, res => { })
          setModalShow1(false)
        }
      })
  }

  const handleReport = () => {
    fetch(`./api/report/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        user_id: auth.id,
        user_uuid: auth.uuid,
        data_id: data.id,
        data_uuid: data.uuid,
        user_category: '企业用户',
        content: document.getElementById('report').value,
        category: '简历',
        datime: moment().format('YYYY-MM-DD HH:mm')
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.content) {
          window.alert('以提交到后台,我们将尽快处理')
          setModalShow2(false)
        }
      })
  }


  return (
    <View category="收藏">
      <div className="row bg-white shadow" >
        <div className="col card rounded-0">
          <div className="card-body">
            <ResumeView bar={(
              <div className="pull-right">
                <button className="btn btn-light rounded-0 text-muted" onClick={handleFavorite} >
                  {
                    favorite ?
                      (<i className="fa fa-star fa-fw" style={{ color: '#FFFF00' }} aria-hidden="true"></i>) :
                      (<i className="fa fa-star-o" aria-hidden="true"></i>)
                  }
                  收藏
                </button>
                <button className="btn btn-light rounded-0 text-muted" disabled={!entStatus} onClick={() => setModalShow1(true)} >
                  <i className="fa fa-comment-o fa-fw" aria-hidden="true"></i>
                  邀请面试
                  </button>
                <button className="btn btn-light rounded-0 text-danger"  onClick={() => setModalShow2(true)}>
                  <i className="fa fa-ban fa-fw" aria-hidden="true"></i>
                  举报
                </button>
              </div>
            )} {...data} />
            <div className="row">
              <div className="col">
                <a href={`#简历/${category}/`} className="btn btn-primary">返回</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="举报"
        show={modalShow2}
        handleSave={handleReport}
        close={() => setModalShow2(false)} >
        <div className="form-group">
          <label>举报原因</label>
          <textarea
            id="report"
            className="form-control" />
        </div>
      </Modal>
      <Modal
        title="发起邀请"
        show={modalShow1}
        handleSave={handleInvite}
        close={() => setModalShow1(false)} >
        <SelectField
          id="recruitment"
          className="form-control form-control-sm"
          category="面试职位">
          {recruitmentList && recruitmentList.map((item, inx) =>
            <option value={item.id} key={inx}>{item.name}</option>
          )}
        </SelectField>
        <div className="form-group">
          <label>联系电话1</label>
          <input id="phone1" type="text" className="form-control form-control-sm" />
        </div>
        <div className="form-group">
          <label>联系电话2</label>
          <input id="phone2" type="text" className="form-control form-control-sm" />
        </div>
        <div className="form-group">
          <label>面试时间</label>
          <input
            id="datime"
            type="datetime-local"
            className="form-control form-control-sm" />
        </div>
        <div className="form-group">
          <label>面试地点</label>
          <textarea
            id="address"
            className="form-control form-control-sm" />
        </div>
        <div className="form-group">
          <label>交通路线</label>
          <textarea
            id="luxian"
            className="form-control form-control-sm" />
        </div>
        <div className="form-group">
          <label>备注</label>
          <textarea
            id="remark"
            className="form-control form-control-sm" />
        </div>
      </Modal>
    </View>
  )

}

export default ResumeDetalis