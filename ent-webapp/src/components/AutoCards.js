import React, { useState, useEffect } from 'react'

import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import moment from 'moment'
import PropTypes from 'prop-types'
const AutoPlaySwipeableViews = autoPlay(SwipeableViews)




const Pagination = props => {

  const handleClick = (event, index) => {
    props.onChangeIndex(index);
  }

  const children = () => {
    const { index, dots } = props

    const list = [];

    for (let i = 0; i < dots; i += 1) {
      list.push(
        <PaginationDot key={i} index={i} active={i === index} onClick={handleClick} />,
      )
    }
    return list
  }
  return (<div className="pagination">{children()}</div>)
}

Pagination.propTypes = {
  dots: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onChangeIndex: PropTypes.func.isRequired,
}


const PaginationDot = props => {


  const styles = {
    root: {
      height: 18,
      width: 18,
      cursor: 'pointer',
      border: 0,
      background: 'none',
      padding: 0,
    },
    dot: {
      backgroundColor: '#e4e6e7',
      height: 12,
      width: 12,
      borderRadius: 6,
      margin: 3,
    },
    active: {
      backgroundColor: '#319fd6',
    },
  }

  const handleClick = event => {
    props.onClick(event, props.index)
  }

  return (
    <button type="button" style={styles.root} onClick={handleClick}>
      <div style={props.active ? Object.assign({}, styles.dot, styles.active) : styles.dot} />
    </button>
  )


}

PaginationDot.propTypes = {
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}


const AutoCards = props => {

  const [index, setIndex] = useState(0)

  const [list, setList] = useState([])

  useEffect(() => {
    if (props.category) {
      const file = JSON.parse(localStorage.getItem(props.category))
      const fun = () => {
        fetch(`./api/banner/${props.category}/`)
          .then(res => res.json())
          .then(res => {
            if (res.message) {
              window.alert(res.message)
            } else {
              localStorage.setItem(props.category, JSON.stringify({
                date: parseInt(moment().add(7, 'days').format('YYYYMMDD')),
                banner: res.content
              }))
              setList(res.content)
            }
          })
      }
      if (file === null) {
        fun()
      } else {
        if (file.date - moment().format('YYYYMMDD') < 1) {
          fun()
        } else {
          setList(file.banner)
        }
      }
    }
  }, [props.category])


  const handleChangeIndex = index => {
    setIndex(index)
  }

  return (
    <div className="row img-box" >
      {
        (list && list.length > 0) && (
          <AutoPlaySwipeableViews style={{ objectFit: 'cover' }} index={index} onChangeIndex={handleChangeIndex}>
            {
              list.map((item, inx) => (
                <div key={inx}>
                  <a href={item.source_url?item.source_url:`#首页/banner/${item.id}?uuid=${item.uuid}`}>
                    <img className="img-fluid img-box-item" alt="" src={item.data_url}>
                    </img>
                  </a>
                </div>
              ))
            }
          </AutoPlaySwipeableViews>
        )
      }
      <Pagination dots={list.length} index={index} onChangeIndex={handleChangeIndex} />
    </div>
  )
}

export default AutoCards