'use client'

import React from 'react'

type ActionTabPlaceholderProps = {
  title: string
  description: string
}

const ActionTabPlaceholder: React.FC<ActionTabPlaceholderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="rounded-[12px] border border-gray-20 bg-gray-10 p-4 text-b3 text-gray-90">
      <h3 className="text-s2 font-semibold text-green-100">{title}</h3>
      <p className="mt-2">{description}</p>
    </div>
  )
}

export default ActionTabPlaceholder

