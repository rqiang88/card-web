"use client"

import * as React from "react"

interface SimpleChartProps {
  data: Array<{ date: string; value: number }>
  height?: number
  color?: string
  type?: 'line' | 'bar'
}

export function SimpleChart({ 
  data, 
  height = 200, 
  color = "#10b981",
  type = 'line' 
}: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  const getY = (value: number) => {
    return height - ((value - minValue) / range) * (height - 40) - 20
  }

  const getX = (index: number) => {
    return (index / (data.length - 1)) * 100
  }

  if (type === 'line') {
    const pathData = data.map((point, index) => {
      const x = getX(index)
      const y = getY(point.value)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    return (
      <div className="w-full" style={{ height }}>
        <svg width="100%" height="100%" viewBox={`0 0 100 ${height}`} className="overflow-visible">
          {/* 网格线 */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
          
          {/* 渐变填充 */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* 填充区域 */}
          <path
            d={`${pathData} L 100 ${height} L 0 ${height} Z`}
            fill="url(#gradient)"
          />
          
          {/* 线条 */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* 数据点 */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(point.value)}
              r="3"
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    )
  }

  // 柱状图
  return (
    <div className="w-full" style={{ height }}>
      <svg width="100%" height="100%" viewBox={`0 0 100 ${height}`}>
        {data.map((point, index) => {
          const barHeight = ((point.value - minValue) / range) * (height - 40)
          const x = (index / data.length) * 100 + 2
          const width = (100 / data.length) - 4
          
          return (
            <rect
              key={index}
              x={x}
              y={height - barHeight - 20}
              width={width}
              height={barHeight}
              fill={color}
              rx="2"
            />
          )
        })}
      </svg>
    </div>
  )
}
