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
        const dropPosition =
          e.clientX - currentBottomRef.getBoundingClientRect().left
        const snappedPosition = calculateSnappedPosition(dropPosition)
        setItemData((prev) => {
          // 如果 itemData 为空，则添加新的图片，否则不做任何操作
          if (prev.length === 0) {
            return [{ src: imageUrl, position: snappedPosition }]
          }
          return prev
        })
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

    return () => {
      if (leftRef) {
        leftRef.removeAttribute('draggable')
      }
    }
  }, [leftRef])

  // 计算吸附到时间轴的位置
  function calculateSnappedPosition(position) {
    const snapInterval = 50 // 每隔50px吸附一次
    return Math.round(position / snapInterval) * snapInterval
  }

  // 处理时间轴上图片拖拽开始事件
  function handleDragStart(e, index) {
    e.dataTransfer.setData('index', index)
  }

  // 处理时间轴上图片的放置事件
  function handleDrop(e) {
    e.preventDefault()
    const index = parseInt(e.dataTransfer.getData('index'), 10)
    const dropPosition =
      e.clientX - bottomRef.current.getBoundingClientRect().left
    const snappedPosition = calculateSnappedPosition(dropPosition)
    setItemData((prev) => {
      const newData = [...prev]
      newData[index] = { ...newData[index], position: snappedPosition }
      return newData
    })
  }

  return (
    <div
      ref={bottomRef}
      onDrop={handleDrop}
      className='w-full relative h-80 bg-blue-500'
      onDragOver={(e) => e.preventDefault()}>
      {/* 渲染时间轴 */}
      <div className='absolute w-full h-1 bg-black top-1/2 transform -translate-y-1/2'></div>

      {/* 渲染拖拽的图片 */}
      {itemData.map((item, index) => (
        <img
          key={index}
          src={item.src}
          alt='Dragged'
          className='w-20 h-20 absolute cursor-pointer'
          style={{
            left: `${item.position}px`,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, index)}
        />
      ))}
    </div>
  )
}

export default BottomBoard
