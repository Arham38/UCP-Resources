import Home from './components/Home'
import Content from './components/Content'
import Footer from './components/Footer'
import Profile from './components/Profile'

const App = () =>{
  return(
    <div>
      <Profile name="Zain" city="Lahore"  />
       <Profile name="Ali" city="Islamabad"  />
    </div>
  )
}

export default App