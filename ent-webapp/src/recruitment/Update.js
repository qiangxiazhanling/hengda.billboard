import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import { TextField, SelectField, IndustryField } from '../components/InputField'
import { EditJournal } from '../commonFetch'
import RichEditor from '../components/RichEditor'
import { View } from './Components'

const Update = () => {

  const [data, setData] = useState({
    name: '',
    category: '',
    industry: '',
    status: '',
    education: '',
    salary1: '',
    salary2: '',
    address1: '',
    address2: '',
    address3: '',
    description: '',
    requirement: '',
  })

  const [city, setCity] = useState([])

  const [area, setArea] = useState([])

  const [auth, setAuth] = useState(0)

  const [name, setName] = useState('')

  const { id } = useParams()

  const { search } = useLocation()

  const [level, setLevel] = useState([])

  const [address, setAddress] = useState([])


  useEffect(() => {
    const _auth = JSON.parse(sessionStorage.getItem('auth'))
    if (_auth === null) {
      window.location = '#登录'
      return
    }
    setAuth(_auth)
    fetch(`./api/recruitment/${id}${search}`)
      .then(res => res.json())
      .then(res => {
        if (res.content) {
          setName(res.content.name)
          setData(p => res.content)
        } else {
          alert(res.message)
        }
      })
    fetch(`/lib/address.json`)
      .then(res => res.json())
      .then(res => {
        setAddress(res)
        setLevel(
          Object.getOwnPropertyNames(res)
            .filter(item => item.slice(2, 7) === '0000')
            .map(code => ({
              code: code,
              name: res[code]
            }))
        )
      })
  }, [id, search])

  useEffect(() => {
    if (level.length > 0) {
      const a1 = level.find(item => item.name === data.address1)
      if (a1) {
        setCity(Object.getOwnPropertyNames(address)
          .filter(it => a1.code.slice(0, 2) === it.slice(0, 2) && it.slice(4, 7) === '00' && it !== a1.code)
          .map(code => ({
            code: code,
            name: address[code]
          })))
      }
    }
  }, [data, level, address])


  useEffect(() => {
    if (city && city.length > 0) {
      const a2 = city.find(item => item.name === data.address2)
      if (a2) {
        setArea(
          Object.getOwnPropertyNames(address)
            .filter(it => a2.code.slice(0, 4) === it.slice(0, 4) && it !== a2.code)
            .map(code => ({
              code: code,
              name: address[code]
            }))
        )
      }
    }
  }, [data, city, address])

  const handleChange = e => {
    const { value, name } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    fetch(`./api/recruitment/${id}${search}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...data,
        user_id: auth.id
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          window.alert(res.message)
        } else {
          EditJournal({
            category2:'岗位',
            data_id:data.id,
            remark:`修改岗位<${data.name}>`
          }, res => {})
          window.alert('操作成功')
          window.location = '#岗位/列表'
        }
      })
  }

  const handleProvince = e => {
    const value = e.target.value
    if (value !== '') {
      const a1 = level.find(item => item.name === value)
      if (a1) {
        setCity(Object.getOwnPropertyNames(address)
          .filter(it => a1.code.slice(0, 2) === it.slice(0, 2) && it.slice(4, 7) === '00' && it !== a1.code)
          .map(code => ({
            code: code,
            name: address[code]
          })))
      }
      setData({
        ...data,
        address1: value,
        address2: '',
        address3: ''
      })
      setArea([])
    } else {
      setData({
        ...data,
        address1: value,
        address2: value,
        address3: value
      })
      setCity([])
      setArea([])
    }
  }

  const handleCity = e => {
    const value = e.target.value
    if (value !== '') {
      setData({
        ...data,
        address2: value,
        address3: ''
      })
      const a2 = city.find(item => item.name === value)
      if (a2) {
        setArea(
          Object.getOwnPropertyNames(address)
            .filter(it => a2.code.slice(0, 4) === it.slice(0, 4) && it !== a2.code)
            .map(code => ({
              code: code,
              name: address[code]
            }))
        )
      }
    } else {
      setData({
        ...data,
        address2: value,
        address3: value
      })
      setArea([])
    }
  }

  const handleDataStatus = v => {
    fetch(`./api/recruitment/status/${id}${search}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        status: v,
        user_id: auth.id,
        name: name
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          window.alert(res.message)
        } else {
          EditJournal({
            category2:'岗位',
            data_id:data.id,
            remark:`修改岗位状态为-<${data.status}>`
          }, res => {})
          setData({
            ...data,
            status: v
          })
        }
      })
  }

  return (
    <View category="我的职位">
      <div className="row bg-white shadow" >
        <div className="col card rounded-0">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <h3 className="pull-left">编辑岗位</h3>
                {
                  data.status === '在招' ? (
                    <button
                      className="pull-right btn btn-link btn-lg text-danger"
                      onClick={() => handleDataStatus('停招')} >
                      <i className=" fa fa-ban fa-fw " aria-hidden="true"></i>
                      停招
                    </button>
                  ) : (
                      <button
                        className="pull-right btn btn-link btn-lg text-success"
                        onClick={() => handleDataStatus('在招')} >
                        复招
                      </button>
                    )
                }

              </div>
            </div>
            <hr style={{ marginTop: 0 }} />
            <div className="row">
              <div className="col">
                <TextField
                  category="职位名称"
                  name="name"
                  value={data.name}
                  handleChange={handleChange} />
              </div>
              <IndustryField
                industry={data.industry}
                position={data.position}
                handleChange={handleChange} />
              <div className="col">
                <SelectField
                  category="职位类型"
                  name="category"
                  value={data.category || ''}
                  handleChange={handleChange}>
                  <option></option>
                  <option>全职</option>
                  <option>兼职</option>
                  <option>实习</option>
                </SelectField>
              </div>
              <div className="col">
                <SelectField
                  category="学历要求"
                  name="education"
                  value={data.education}
                  handleChange={handleChange}>
                  <option></option>
                  <option>不限</option>
                  <option>高中以上</option>
                  <option>专科以上</option>
                  <option>本科以上</option>
                </SelectField>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <SelectField
                  category="省/直辖市"
                  name="address1"
                  value={data.address1}
                  handleChange={handleProvince}>
                  <option></option>
                  {
                    level.map((item, inx) =>
                      <option key={inx}>{item.name}</option>)
                  }
                </SelectField>
              </div>
              <div className="col">
                <SelectField
                  category="市"
                  name="address2"
                  value={data.address2}
                  handleChange={handleCity}>
                  <option></option>
                  {
                    city && city.map((item, inx) =>
                      <option key={inx}>{item.name}</option>)
                  }
                </SelectField>
              </div>
              <div className="col">
                <SelectField
                  category="区/县"
                  name="address3"
                  value={data.address3}
                  handleChange={handleChange}>
                  <option></option>
                  {
                    area.map((item, inx) =>
                      <option key={inx}>{item.name}</option>)
                  }
                </SelectField>
              </div>
              <div className="col">
                <TextField
                  category="薪资要求1"
                  name="salary1"
                  value={data.salary1}
                  handleChange={handleChange} />
              </div>
              <div className="col">
                <TextField
                  category="薪资要求2"
                  name="salary2"
                  value={data.salary2}
                  handleChange={handleChange} />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <TextField
                  category="招聘人数"
                  name="qty"
                  value={data.qty}
                  handleChange={handleChange} />
              </div>
              <div className="col" />
              <div className="col" />
              <div className="col" />
              <div className="col" />
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>职位要求</label>
                  <RichEditor
                    value={data.requirement}
                    name="requirement"
                    handleChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>工作内容</label>
                  <RichEditor
                    value={data.description}
                    name="description"
                    handleChange={handleChange} />
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <a className="btn btn-primary" href="#岗位/列表">
                  返回
              </a>
              </div>
              <div className="col">
                <div className="pull-right">
                  <button className="btn btn-success" onClick={handleSave}>
                    保存
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </View>
  )

}


export default Update