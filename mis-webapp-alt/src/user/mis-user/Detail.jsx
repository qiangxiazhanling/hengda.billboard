import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import md5 from 'blueimp-md5';

import Navbar from '../../component/Navbar';
import SideNav from '../ComponentSideNav';
import Toolbar from './ComponentToolbar';

export default function Detail({ category }) {
  const { id } = useParams();
  const location = useLocation();
  const [uuid, setUUID] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  const handleRemove = async () => {
    if (!window.confirm('确定删除当前数据？')) return;
    const response = await window.fetch(`/api/mis-user/${id}?uuid=${uuid}`, {
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
    if (!name || !username) {
      window.alert('请完整填写所需信息');
      return;
    }

    const data = {
      username,
      password: md5('112332'),
      name,
    };

    if (category === '新增') {
      const response = await fetch('/api/mis-user/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.message) {
        window.alert(res.message);
        return;
      }
      window.history.go(-1);
    } else if (category === '编辑') {
      const response = await fetch(`/api/mis-user/${id}?uuid=${uuid}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.message) {
        window.alert(res.message);
        return;
      }
      window.history.go(-1);
    }
  };

  useEffect(() => {
    if (category === '编辑') {
      (async () => {
        const t_uuid = new URLSearchParams(location.search).get('uuid');
        setUUID(t_uuid);
        const response = await fetch(`/api/mis-user/${id}?uuid=${t_uuid}`);
        const res = await response.json();
        setName(res.content.name);
        setUsername(res.content.username);
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar category="用户" />

      <div className="container mt-3 mb-5">
        <div className="row">
          <div className="col-3 col-lg-2">
            <SideNav />
          </div>

          <div className="col-9 col-lg-10">
            <h3>
              {category}
              {' '}
              平台用户
            </h3>
            <hr />

            {category === '新增' && (
              <div className="alert alert-warning">
                新增用户的默认密码为112332
              </div>
            )}

            <Toolbar />

            <div className="card bg-dark shadow">
              <div className="card-body">
                <div className="form-group">
                  <label>姓名</label>
                  <input
                    type="text"
                    value={name || ''}
                    className="form-control"
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>用户名</label>
                  <input
                    type="text"
                    value={username || ''}
                    className="form-control"
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
              </div>

              <div className="card-footer">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => { window.history.go(-1); }}
                  >
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
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>
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
