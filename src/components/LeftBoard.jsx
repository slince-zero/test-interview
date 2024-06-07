import { Image } from '@nextui-org/react'
import { useRef, useContext, useEffect } from 'react'
import { TestContext } from '../context/TestContext'
function LeftBoard() {
  const { setLeftRef } = useContext(TestContext)
  const imageRef = useRef(null)

  useEffect(() => {
    if (imageRef.current) {
      setLeftRef(imageRef.current)
    }
  }, [imageRef.current])
  return (
    <div className='h-full w-60 bg-blue-600'>
      <Image
        ref={imageRef}
        width={150}
        height={150}
        alt='土拨鼠'
        src='src/assets/土拨鼠叫.jpg'
        className='p-2 cursor-pointer'
      />
    </div>
  )
}

export default LeftBoard
