import React, { SVGProps, useCallback, useEffect, useState } from 'react'
import { Area, AreaProps } from 'recharts'
import deepEqual from 'deep-equal'
import { Point } from 'recharts/types/shape/Curve'

type CustomAreaProps = React.ComponentProps<typeof Area> &
  CustomComponentAreaProps

class CustomArea extends Area {
  constructor(props: CustomAreaProps) {
    super(props)
    props.onUpdatePoints(props.points)
  }

  componentDidUpdate(this: any, prevProps: Readonly<CustomAreaProps>) {
    if (!deepEqual(prevProps.points, this.props.points)) {
      this.props.onUpdatePoints(this.props.points)
    }
  }
}

CustomArea.getBaseValue = Area.getBaseValue
CustomArea.displayName = 'Area'

type AreaLibProps = Omit<SVGProps<SVGElement>, 'type'> & AreaProps

interface AreaPointItem extends Point {
  value?: number | number[]
  payload?: any
}

interface CustomComponentAreaProps {
  onUpdatePoints(points?: AreaPointItem[]): void
}

export const CustomComponentArea = CustomArea as unknown as React.FC<
  CustomComponentAreaProps & AreaLibProps
>

const getPointValue = (point: AreaPointItem): number => {
  if (!point.value) return 0

  return Array.isArray(point.value) ? point.value[1] : point.value
}

export const useStaticTooltip = () => {
  const [points, setPoints] = useState<AreaPointItem[]>([])
  const [staticPointItem, setStaticPointItem] = useState<any | null>(null)

  useEffect(() => {
    if (points.length > 0) {
      const maxValue = points.reduce((acc, cur) => {
        const value = getPointValue(cur)
        return acc < value ? value : acc
      }, 0)

      setStaticPointItem(
        points.find((p) => getPointValue(p) === maxValue) || null
      )
    }
  }, [points])

  const handleSetPoints = useCallback(
    (newPoints?: AreaPointItem[]) => {
      if (newPoints && !deepEqual(newPoints, points)) setPoints(newPoints)
    },
    [setPoints, points]
  )

  return {
    setPoints: handleSetPoints,
    staticPointItem,
  }
}

export default {}
