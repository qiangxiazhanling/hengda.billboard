import React from 'react'


export const RecruitmentRow = props => (
  <>
    <div className="row">
      <div className="col">
        <div className="pull-left">
          <strong>{props.name}</strong>
        </div>
        <div className="pull-right">
          <a style={{ fontSize: 14 }} className="badge badge-pill badge-info" href={`#/岗位/${props.id}?u_id=${props.uuid}`}>
            查看
          </a>
        </div>
        <br></br>
        <span className="text-success">
          {
            props.salary1 && props.salary2 ?
              `${props.salary1}-${props.salary2}` :
              '面议'
          }
        </span>{
          props.salary1 && props.salary2 ? '元月' : ''
        }
        <br></br>
        <span className="pull-left text-muted" style={{ fontSize: 11 }}>
          {props.address1} {props.address2}/{props.education} | 招聘人数:{props.qty}
        </span>
        <span className="pull-right text-muted" style={{ fontSize: 11 }}>
          发布于: {props.date}
        </span>
      </div>
    </div>
    <hr style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />
  </>
)


export const RecruitRow = props => (
  <>
    <div className="row" >
      <div className="col">
        <div className="pull-left">
          <strong>{props.name}</strong>
        </div>
        <div className="pull-right">
          <a href={`#/校园招聘/${props.id}?u_id=${props.uuid}`}>
            详情
          <i className="fa fa-fw fa-lg  fa-angle-right"></i>
          </a>
        </div>
        <br></br>
        <span className="text-muted">
          举办地点:{props.address3} | 开始时间:{props.date}
        </span>
        <br></br>
        <span>
          {props.enterprise_name}({props.category})
        </span>
      </div>
    </div>
    <hr style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />
  </>
)

export const RecommendRow = props => (
  <>
    <div className="row" >
      <div className="col">
        <div className="pull-left">
          <strong>{props.name}</strong>
        </div>
        <div className="pull-right">
          <a href={`#主页/消息详情/${props.id}?u_id=${props.uuid}`}>
            详情
        <i className="fa fa-fw fa-lg  fa-angle-right"></i>
          </a>
        </div>
        <br></br>
        <span className="text-muted">
          工作地点：{props.address1}-{props.address2} | 招聘人数: {props.qty}
        </span>
        <br></br>
        <span>
          {props.enterprise_name}
        </span>
      </div>
    </div>
    <hr style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />
  </>
)