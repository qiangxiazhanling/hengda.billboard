import React, { useEffect } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Title from '../components/Title'
// import Footer from '../components/Footer'
import Enterprise from './Enterprise'
import Update from './Update'
import Feedback from './Feedback'
import UpdatePassword from './UpdatePassword'


const Index = () => {
  useEffect(() => {
    const auth = sessionStorage.getItem('auth')
    if (auth === null) {
      window.location = '#登录'
    }
  }, [])

  return (
    <div className="container-fluid pb-5">
      <Title />
      <Navbar category="我的" totalFlg />
      <Router>
        <Switch>
          <Route exact path="/我的/信息/" ><Enterprise /></Route>
          <Route exact path="/我的/信息/编辑/" ><Update /></Route>
          <Route exact path="/我的/投诉/"><Feedback /></Route>
          <Route exact path="/我的/修改密码"><UpdatePassword /></Route>
        </Switch>
      </Router>
      {/* <Footer /> */}
    </div>
  )
}

export default Index