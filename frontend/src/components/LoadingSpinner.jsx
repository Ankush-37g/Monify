import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-white font-semibold">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner