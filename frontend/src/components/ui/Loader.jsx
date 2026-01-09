import React from 'react'

const Loader = ({ bg = false }) => {
    return (
        <div className={`${bg && "bg-transparent bg-opacity-50"} absolute inset-0 flex flex-col justify-center items-center z-50`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-6">
            </div>
        </div>
    )
}

export default Loader
