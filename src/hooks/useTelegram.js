﻿const tg = window.Telegram.WebApp;
export function useTelegram() {

    const onTeamCard = (teamID) => {
        //getTeamCard(teamId)
        window.location.href = '';
        tg.href 
    }

    const onClose = () => {
        tg.close();
    }

    const onToggleButton = () => {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }

    return {
        onClose,
        onToggleButton,
        tg,
        user: tg.initDataUnsafe?.user,
        queryId: tg.initDataUnsafe?.query_id,
    }
}