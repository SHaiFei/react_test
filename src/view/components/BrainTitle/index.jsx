import React from 'react'

const style = {
  title: {
    width: '100%',
    backgroundColor: '#e4f1fe',
    height: '50px',
    lineHeight: '50px',
    paddingLeft: '14px',
    fontWeight: 'bold',
    borderRadius: '5px',
    marginBottom: '14px',
    fontSize: '16px'
  },
  annotation: {
    fontSize: '12px',
    color: '#c6c7c7',
    display: 'inline-block',
    width: '280px',
    marginLeft: '8px',
  },
};
export default function BrainTitle ({ title, annotation }) {
  return (
    <div>
      <div className="titlle" style={style.title}>
        {title}
        {annotation && <span className="annotation" style={style.annotation}>{annotation}</span>}
      </div>
    </div>
  )
}
