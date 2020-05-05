import React, { useState, useEffect, useRef } from 'react';
import './Autocomplete.scss';

const keyCode = {
  RETURN: 13,
  SPACE: 32,
  UP: 38,
  DOWN: 40
};

const Autocomplete = ({ id, placeholder, list, onSelect, onChange }) => {
  const [inFocus, setInFocus] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const listElementRef = useRef(null);

  useEffect(() => {
    if (inFocus) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  });

  function toggleFocus(e, defocus = false) {
    if (e.type === 'blur' && e.relatedTarget && e.relatedTarget.id === `${id}-list`) {
      e.preventDefault();
    } else if (defocus) {
      setInFocus(false);
    } else {
      setInFocus(!inFocus);
    }
  }

  function handleListScroll(currentItem) {
    const listElement = listElementRef.current;
    // Scroll only if the list height exceeds the viewablle max height
    if (listElement && currentItem && listElement.scrollHeight > listElement.clientHeight) {
      // Get the height needed for the current eleemnt to be in view
      var currentItemBottom = currentItem.offsetTop + currentItem.offsetHeight;
      // Check if the current item is in view
      if (currentItemBottom > (listElement.clientHeight + listElement.scrollTop)) {
        // Stick current item at the bottom
        listElement.scrollTop = currentItemBottom - listElement.clientHeight;
      } else if (currentItem.offsetTop < listElement.scrollTop) {
        // Stick current item at the top
        listElement.scrollTop = currentItem.offsetTop;
      }
    }
  }

  function navigateUp(currentElem) {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (currentElem) {
        currentElem = currentElem.previousElementSibling;
      }
      handleListScroll(currentElem);
    }
  }

  function navigateDown(currentElem) {
    if (currentIndex < (list.length - 1)) {
      setCurrentIndex(currentIndex !== null ? currentIndex + 1 : 0);
      if (currentElem) {
        currentElem = currentElem.nextElementSibling;
      }
      handleListScroll(currentElem);
    }
  }


  function handleButtonPress(event) {
    if (isExpanded) {
      let key = event.which || event.code;
      let currentElem = null;
      if (listElementRef) {
        currentElem = listElementRef.current.querySelector('li.current');
      }
      switch (key) {
        case keyCode.UP: {
          event.preventDefault();
          navigateUp(currentElem);
          break;
        }
        case keyCode.DOWN: {
          event.preventDefault();
          navigateDown(currentElem);
          break;
        }
        case keyCode.RETURN: {
          event.preventDefault();
          listElementRef.current.focus();
          handleSelect(currentIndex, true);
          break;
        }
      }
    }
  }

  function hoverList(hoverIndex) {
    setCurrentIndex(hoverIndex);
  }

  function handleSelect(currentIndex) {
    setInFocus(false);
    onSelect(list[currentIndex]);
  }

  function handleUpdate(e) {
    const term = e.target.value;
    setSearchTerm(term);
    onChange(term);
  }

  return (
    <div className='js-autocomplete-wrapper'>
      <div id={id} className={`wrapper-box autocomplete-wrapper ${isExpanded ? 'expanded' : ''} ${inFocus ? 'focus' : ''}`}>
        <div className='input-wrapper'
          aria-haspopup='listbox'
          onBlur={toggleFocus}
          aria-expanded={isExpanded}>
          <div className="search-icon"></div>
          <input id={`${id}-input`}
            onFocus={(e) => toggleFocus(e, false)}
            onKeyDown={(e) => handleButtonPress(e, this)}
            onChange={handleUpdate}
            placeholder={placeholder} />
        </div>
        <ul ref={listElementRef} id={`${id}-list`} tabIndex='-1' className='custom-select' role='listbox'>
          {list.map((item, index) => <li key={index} role='option'
            id={`${id}-${item.value}`}
            className={`${index === currentIndex ? 'current' : ''}`}
            onMouseOver={(e) => hoverList(index)}
            onClick={(e) => { handleSelect(index) }}>{item}</li>)}
        </ul>
        {searchTerm && list.length === 0 && <div className='no-result'>No User Found</div>}
      </div >
    </div >
  )
}

export default Autocomplete;

