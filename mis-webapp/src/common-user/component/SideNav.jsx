import React from 'react';

export default function SideNav(props) {
  const { category } = props;

  return (
    <div className="list-group">
      <h6 className="text-muted">
        <strong>选择功能</strong>
      </h6>

      <div>
        <a
          href="#普通用户"
          className={`text-small list-group-item list-group-item-action ${category === '列表' ? 'active' : ''}`}
        >
          用户列表
          <span className="pull-right">
            <i className="fa fa-fw fa-angle-right" />
          </span>
        </a>
      </div>
    </div>
  );
}
