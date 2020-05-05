import React from 'react';
import './Suggestion.scss';

function highlightMatch(text, match) {
    return text.replace(new RegExp(match, 'gi'), (match) => `<mark>${match}</mark>`);
}

const Suggestion = (props) => {
    return (
        <div className='suggestion'>
            <div className='id' dangerouslySetInnerHTML={{__html: highlightMatch(props.item.id, props.highlight)}}></div>
            <div className='name' dangerouslySetInnerHTML={{__html: highlightMatch(props.item.name, props.highlight)}}></div>
            <div className='address' dangerouslySetInnerHTML={{__html: highlightMatch(`${props.item.address} - ${props.item.pincode}`, props.highlight)}}></div>
            <div>{props.item.items.map((item, index) => <span key={index} className='item' dangerouslySetInnerHTML={{__html: highlightMatch(item, props.highlight)}}></span>)}</div>
        </div>
    )
}

export default Suggestion;