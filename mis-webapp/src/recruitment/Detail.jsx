import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Title from '../component/Title';
import Navbar from '../component/Navbar';
import InputRowField from '../component/InputRowField';
import BackwardButton from '../component/BackwardButton';
import SideNav from '../enterprise/component/SideNav';

export default function Detail(props) {
  const { cat } = props;
  const { recruitment_id } = useParams();
  const location = useLocation();
  const [uuid, setUUID] = useState('');
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [description, setDescription] = useState('');
  const [requirement, setRequirement] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [date, setDate] = useState('');
  const [salary1, setSalary1] = useState('');
  const [salary2, setSalary2] = useState('');
  const [education, setEducation] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (cat === '编辑') {
      const t_uuid = new URLSearchParams(location.search).get('uuid');
      setUUID(t_uuid);
      (async () => {
        const response = await window.fetch(`/api/recruitment/${recruitment_id}?uuid=${t_uuid}`);
        const res = await response.json();
        if (res.message) {
          window.console.error(res.message);
          return;
        }
        setName(res.content.name);
        setQty(res.content.qty);
        setDescription(res.content.description);
        setRequirement(res.content.requirement);
        setAddress1(res.content.address1);
        setAddress2(res.content.address2);
        setAddress3(res.content.address3);
        setDate(res.content.date);
        setSalary1(res.content.salary1);
        setSalary2(res.content.salary2);
        setEducation(res.content.education);
        setCategory(res.content.category);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (cat === '编辑') {
      const response = await window.fetch(`/api/recruitment/${recruitment_id}?recruitment_uuid=${uuid}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          qty,
          description,
          requirement,
          address1,
          address2,
          address3,
          date,
          salary1,
          salary2,
          education,
          category,
        }),
      });
      const res = await response.json();
      if (res.message) {
        window.alert(res.message);
        return;
      }
      window.history.go(-1);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('确定要删除当前数据？')) return;
    const response = await window.fetch(`/api/recruitment/${recruitment_id}?recruitment_uuid=${uuid}`, {
      method: 'DELETE',
    });
    const res = await response.json();
    if (res.message) {
      window.alert(res.message);
      return;
    }
    window.history.go(-1);
  };

  return (
    <>
      <Title />
      <Navbar />

      <div className="container-fluid mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav />
          </div>

          <div className="col-9 col-lg-10">
            <h3>
              企业用户
              {cat}
              {' '}
              职位
            </h3>
            <hr />

            <div className="card shadow">
              <div className="card-body">
                <InputRowField caption="职位" value={name || ''} onChange={(e) => setName(e.target.value)} />

                <InputRowField caption="人数" value={qty || ''} onChange={(e) => setQty(e.target.value)} />

                <InputRowField caption="地址" value={address1 || ''} onChange={(e) => setAddress1(e.target.value)} />

                <InputRowField caption="" value={address2 || ''} onChange={(e) => setAddress2(e.target.value)} />

                <InputRowField caption="" value={address3 || ''} onChange={(e) => setAddress3(e.target.value)} />

                <InputRowField caption="发布日期" value={date || ''} onChange={(e) => setDate(e.target.date)} />

                <InputRowField caption="薪资范围" value={salary1 || ''} onChange={(e) => setSalary1(e.target.salary1)} />

                <InputRowField caption="" value={salary2 || ''} onChange={(e) => setSalary2(e.target.salary2)} />

                <InputRowField caption="学历" value={education || ''} onChange={(e) => setEducation(e.target.education)} />

                <InputRowField caption="类别" value={category || ''} onChange={(e) => setCategory(e.target.category)} />

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">工作职责</label>
                  <div className="col-sm-10">
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
                      value={description}
                      onChange={setDescription}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">岗位要求</label>
                  <div className="col-sm-10">
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
                      value={requirement || ''}
                      onChange={setRequirement}
                    />
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="btn-group">
                  <BackwardButton />
                </div>

                <div className="btn-group pull-right">
                  {cat === '编辑' && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
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
