import React from 'react'
export default function Add({ type, inputs, userId }) {
    return (<>
        {inputs.map((input, index) => (
            <div key={index}>
                <label>{input}</label>
                <input type="text" name={input} />
            </div>
        ))}
    </>)

}