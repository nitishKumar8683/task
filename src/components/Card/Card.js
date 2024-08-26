import React from 'react';

const Card = ({ title, count, icon }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="text-4xl text-blue-500 mb-4">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
                <p className="text-3xl font-bold text-gray-900">{count}</p>
            </div>
        </div>
    );
};

export default Card;
