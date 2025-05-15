import React from 'react';
import './ListTeams.css';
import TwoColumnScrollable from './TwoColumnScrollable/TwoColumnScrollable';

const ListTeams = () => {
    /*const data1 = [
        'Элемент 1',
        'Элемент 2',
        'Элемент 3',
        'Элемент 4',
        'Элемент 5',
    ];*/

    const data = [
        {
            TeamId: 1,
            TeamName: 'Navi',
            NumberWins: 1,
            NumberDefeats: 0,
            FrequencyWins: '1.00'
        },
        {
            TeamId: 2,
            TeamName: 'DreamTeam',
            NumberWins: 0,
            NumberDefeats: 1,
            FrequencyWins: '0.00'
        },
        {
            TeamId: 3,
            TeamName: 'Eteam',
            NumberWins: 0,
            NumberDefeats: 0,
            FrequencyWins: '0'
        }
    ];

    return (
        <div>
            <h2>Cписок команд вуза</h2>
            <TwoColumnScrollable items={data}></TwoColumnScrollable>
        </div>
    )
}

export default ListTeams