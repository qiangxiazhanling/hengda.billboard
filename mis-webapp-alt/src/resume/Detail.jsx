import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Navbar from '../component/Navbar';
import SchoolPickerRowField from '../component/SchoolPickerRowField';
import IndustryPickerRowField from '../component/IndustryPickerRowField';
import EducationPickerRowField from '../component/EducationPickerRowField';
import AddressLevel3PickerRowField from '../component/AddressLevel3PickerRowField';
import SideNav from '../user/ComponentSideNav';

export default function Detail({ category }) {
  const { id } = useParams();
  const location = useLocation();
  const [uuid, setUUID] = useState('');
  const [address_keys, setAddressKeys] = useState([]);
  const [address_values, setAddressValues] = useState([]);
  const [arr1, setArr1] = useState([]);
  const [arr2, setArr2] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [education, setEducation] = useState('');
  const [date_begin, setDateBegin] = useState('');
  const [date_end, setDateEnd] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [ziwopingjia, setZiwopingjia] = useState('');
  const [qiwangzhiwei, setQiwangzhiwei] = useState('');
  const [qiwanghangye, setQiwanghangye] = useState('');
  const [yixiangchengshi, setYixiangchengshi] = useState('');

  useEffect(() => {
    if (category === '编辑') {
      const t_uuid = new URLSearchParams(location.search).get('uuid');
      setUUID(t_uuid);
      (async () => {
        const response = await window.fetch(`/api/resume/${id}?uuid=${t_uuid}`);
        const res = await response.json();
        if (res.message) {
          window.console.error(res.message);
          return;
        }
        setName(res.content.name);
        setPhone(res.content.phone);
        setEmail(res.content.email);
        setGender(res.content.gender);
        setBirthday(res.content.birthday);
        setSchool(res.content.school);
        setMajor(res.content.major);
        setEducation(res.content.education);
        setDateBegin(res.content.date_begin);
        setDateEnd(res.content.date_end);
        setAddress1(res.content.address1);
        setAddress2(res.content.address2);
        setZiwopingjia(res.content.ziwopingjia);
        setQiwangzhiwei(res.content.qiwangzhiwei);
        setQiwanghangye(res.content.qiwanghangye);
        setYixiangchengshi(res.content.yixiangchengshi);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const response = await window.fetch('/lib/address.json');
      const res = await response.json();
      const keys = Object.keys(res);
      setAddressKeys(keys);
      const values = Object.values(res);
      setAddressValues(values);
      const arr = [];
      keys.forEach((e, index) => {
        if (e.slice(-4) === '0000') {
          arr.push(values[index]);
        }
      });
      setArr1(arr);
    })();
  }, []);

  useEffect(() => {
    const arr = [];
    setArr2(arr);
    for (let i = 0; i < address_values.length; i += 1) {
      if (address_values[i] === address1) {
        const code = address_keys[i];
        for (let j = 0; j < address_keys.length; j += 1) {
          if (address_keys[j].slice(0, 2) === code.slice(0, 2) && address_keys[j].slice(-2) === '00') {
            if (address_keys[j].slice(-4) !== '0000') arr.push(address_values[j]);
          }
        }
        return;
      }
    }
    setArr2(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address1]);

  const handleRemove = async () => {
    if (!window.confirm('确定删除当前数据？')) return;
    const response = await window.fetch(`/api/resume/${id}?uuid=${uuid}`, {
      method: 'DELETE',
    });
    const res = await response.json();
    if (res.message) {
      window.alert(res.message);
      return;
    }
    window.history.go(-1);
  };

  const handleSubmit = async () => {
    if (category === '编辑') {
      const response = await window.fetch(`/api/resume/${id}?uuid=${uuid}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          gender,
          birthday,
          school,
          major,
          education,
          date_begin,
          date_end,
          address1,
          address2,
          ziwopingjia,
          qiwangzhiwei,
          qiwanghangye,
          yixiangchengshi,
        }),
      });
      const res = response.json();
      if (res.message) {
        window.alert(res.message);
        return;
      }
      window.history.go(-1);
    }
  };

  return (
    <>
      <Navbar category="普通用户" />

      <div className="container mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav />
          </div>

          <div className="col-9 col-lg-10">
            <h3>
              普通用户
              {category}
              {' '}
              简历
            </h3>
            <hr />

            <div className="btn-group mb-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { window.history.go(-1); }}>
                返回
              </button>
            </div>

            <div className="card bg-dark shadow">
              <div className="card-body">
                <div calssName="form-group">
                  <label>姓名</label>
                  <input
                    type="text"
                    value={name || ''}
                    className="form-control"
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                <div calssName="form-group">
                  <label>电话</label>
                  <input
                    type="tel"
                    value={phone || ''}
                    className="form-control"
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>

                <div calssName="form-group">
                  <label>EMAIL</label>
                  <input
                    type="email"
                    value={email || ''}
                    className="form-control"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div calssName="form-group">
                  <label>性别</label>
                  <input
                    type="text"
                    value={gender || ''}
                    className="form-control"
                    onChange={(event) => setGender(event.target.value)}
                  />
                </div>

                <div calssName="form-group">
                  <label>出生日期</label>
                  <input
                    type="date"
                    value={birthday || ''}
                    className="form-control"
                    onChange={(event) => setBirthday(event.target.value)}
                  />
                </div>

                <SchoolPickerRowField
                  caption="毕业院校"
                  value={school || ''}
                  onChange={(event) => setSchool(event.target.value)}
                />

                <div calssName="form-group">
                  <label>专业</label>
                  <input
                    type="text"
                    value={major || ''}
                    className="form-control"
                    onChange={(event) => setMajor(event.target.value)}
                  />
                </div>

                <EducationPickerRowField
                  caption="学历"
                  value={education || ''}
                  onChange={(event) => setEducation(event.target.value)}
                />

                <div calssName="form-group">
                  <label>开始日期</label>
                  <input
                    type="date"
                    value={date_begin || ''}
                    className="form-control"
                    onChange={(event) => setDateBegin(event.target.value)}
                  />
                </div>

                <div calssName="form-group">
                  <label>结束日期</label>
                  <input
                    type="date"
                    value={date_end || ''}
                    className="form-control"
                    onChange={(event) => setDateEnd(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>地址</label>
                  <select
                    value={address1 || ''}
                    className="form-control"
                    onChange={(event) => setAddress1(event.target.value)}
                  >
                    <option value="">未选择</option>
                    {arr1.map((it) => (
                      <option key={arr1.indexOf(it)} value={it}>{it}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label />
                  <select
                    value={address2 || ''}
                    className="form-control"
                    onChange={(event) => setAddress2(event.target.value)}
                  >
                    <option value="">未选择</option>
                    {arr2.map((it) => (
                      <option key={arr2.indexOf(it)} value={it}>{it}</option>
                    ))}
                  </select>
                </div>

                <hr />

                <div className="form-group">
                  <label>自我评价</label>
                  <ReactQuill
                    formats={[
                      'header', 'align', 'bold', 'italic',
                      'underline', 'blockquote']}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        [{ align: [] }],
                        ['bold', 'italic', 'underline', 'blockquote'],
                      ],
                    }}
                    readOnly
                    placeholder="请填写内容"
                    value={ziwopingjia || ''}
                    onChange={setZiwopingjia}
                  />
                </div>

                <div calssName="form-group">
                  <label>期望职位</label>
                  <input
                    type="text"
                    value={qiwangzhiwei || ''}
                    className="form-control"
                    onChange={(event) => setQiwangzhiwei(event.target.value)}
                  />
                </div>

                <IndustryPickerRowField
                  caption="期望行业"
                  value={qiwanghangye || ''}
                  onChange={(event) => setQiwanghangye(event.target.value)}
                />

                <AddressLevel3PickerRowField
                  caption="意向城市"
                  value={yixiangchengshi || ''}
                  onChange={(event) => setYixiangchengshi(event.target.value)}
                />
              </div>

              <div className="card-footer">
                <div className="btn-group">
                  <button type="button" className="btn btn-secondary" onClick={() => { window.history.go(-1); }}>
                    返回
                  </button>
                </div>

                <div className="btn-group pull-right">
                  {category === '编辑' && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleRemove}
                    >
                      <i className="fa fa-fw fa-trash-o" />
                      删除
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ display: 'none' }}
                    onClick={handleSubmit}
                  >
                    <i className="fa fa-fw fa-save" />
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Detail.propTypes = {
  category: PropTypes.string.isRequired,
};
