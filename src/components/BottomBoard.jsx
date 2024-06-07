import { useRef, useContext, useEffect, useState } from 'react'
import { TestContext } from '../context/TestContext'

function BottomBoard() {
  const { leftRef } = useContext(TestContext)
  const [itemData, setItemData] = useState([])
  // 时间轴（动态添加）
  const [timeLines, setTimeLines] = useState({ id: 1, itmes: [] })
  const [resizing, setResizing] = useState(null)
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
            return [{ src: imageUrl, position: snappedPosition, width: 80 }]
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

  // 处理时间轴上图片大小
  function handleResizeStart(e, index, direction) {
    e.stopPropagation()
    setResizing({ index, direction, startX: e.clientX })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      // 判定是否正在调整大小
      if (!resizing) return;
  
      let deltaWidth = e.clientX - resizing.startX;
      setItemData((prevItems) => {
        const items = [...prevItems];
        const item = items[resizing.index];
  
        // Check direction and apply delta
        switch(resizing.direction) {
          case 'right':
            item.width = Math.max(20, item.width + deltaWidth); // '20' 是你设置的图片的最小宽度
            break;
          case 'left':
            item.width = Math.max(20, item.width - deltaWidth);
            item.position = item.position + deltaWidth; // 保证位置从左侧开始
            break;
          default:
            break;
        }
  
        return items; // 返回更新后的 items 数组
      });
  
      // 更新 resizing 数据，为下一次 resize 准备
      setResizing((prevResizing) => ({
        ...prevResizing,
        startX: e.clientX,
      }));
    };
  
    const handleMouseUp = () => {
      if (resizing) {
        // 如果释放时正在调整大小，则停止
        setResizing(null);
      }
    };
  
    // 在 document 上添加全局监听器，以便在适当时进行宽度调整
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  
    // Dependencies 必须包括 resizing，确保每次 resizing 更新后绑定正确的事件监听器
  }, [resizing]);
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
        <div
          key={index}
          src={item.src}
          alt='Dragged'
          className='w-20 h-20 absolute cursor-pointer'
          style={{
            top: '50%',
            left: `${item.position}px`,
            transform: 'translateY(-50%)',
            width: `${item.width}px`,
            backgroundImage: `url(${item.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, index)}>
          <div
            style={{
              position: 'absolute',
              right: '0px',
              bottom: '0px',
              width: '10px',
              height: '80px',
              cursor: 'ew-resize',
            }}
            onMouseDown={(e) => handleResizeStart(e, index, 'right')}></div>
          <div
            style={{
              position: 'absolute',
              left: '0px',
              bottom: '0px',
              width: '10px',
              height: '80px',
              cursor: 'ew-resize',
            }}
            onMouseDown={(e) => handleResizeStart(e, index, 'left')}></div>
        </div>
      ))}
    </div>
  )
}

export default BottomBoard
