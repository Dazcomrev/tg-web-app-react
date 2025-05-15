import React from 'react';
import './PlayerCard.css';

const PlayerCard = (props) => {
    return (
        <button {...props} className={'button ' + props.className } />
    )
}

export default PlayerCard