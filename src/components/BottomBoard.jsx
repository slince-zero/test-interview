import { useRef, useContext, useEffect, useState } from 'react'
import { TestContext } from '../context/TestContext'

function BottomBoard() {
  const { leftRef } = useContext(TestContext)
  const [itemData, setItemData] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    if (leftRef && bottomRef) {
      const currentBottomRef = bottomRef.current

      currentBottomRef.addEventListener('dragover', (e) => {
        e.preventDefault()
      })

      currentBottomRef.addEventListener('drop', (e) => {
        e.preventDefault()
        const imageUrl = e.dataTransfer.getData('image')

        setItemData((prev) => [...prev, imageUrl])
      })
    }
  }, [leftRef])

  // 添加图片的拖拽属性
  useEffect(() => {
    if (leftRef) {
      leftRef.setAttribute('draggable', 'true')

      leftRef.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('image', leftRef.src)
      })
    }

    // return () => {
    //   if (leftRef) {
    //     leftRef.removeAttribute('draggable')
    //   }
    // }
  }, [leftRef])

  return (
    <div
      ref={bottomRef}
      className='w-full h-60 bg-blue-500'>
      {itemData.map((src, index) => (
        <img
          key={index}
          src={src}
          alt='Dragged'
          className='w-20 h-20'
        />
      ))}
    </div>
  )
}

export default BottomBoard
