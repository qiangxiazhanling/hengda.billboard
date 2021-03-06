import React from 'react';

export default function Toolbar() {
  return (
    <div className="mb-2">
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-outline-success btn-sm shadow"
          onClick={() => { window.location = '#平台内容/校园招聘/新增'; }}
        >
          <i className="fa fa-fw fa-plus" />
          新增
        </button>
      </div>

      <div className="btn-group pull-right">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm shadow"
          onClick={() => { window.location = '#平台内容/校园招聘'; }}
        >
          <i className="fa fa-fw fa-list" />
          列表
        </button>
      </div>
    </div>
  );
}
