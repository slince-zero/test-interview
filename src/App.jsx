import LeftBoard from './components/LeftBoard'
import BottomBoard from './components/BottomBoard'
import CenterBoard from './components/CenterBoard'

function App() {
  return (
    <div className='flex h-screen'>
      <div>
        <LeftBoard />
      </div>
      <div className='flex flex-col flex-1 h-screen'>
        <div className='flex-grow'>
          <CenterBoard />
        </div>
        <div className='w-full mt-auto'>
          <BottomBoard />
        </div>
      </div>
    </div>
  )
}

export default App
