const tg = window.Telegram.WebApp;
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
        queryId: tg.initDataUnsafe?.query_id,
        userId: tg.initDataUnsafe?.user.id || 'unknown_user',
        //first_name: tg.initDataUnsafe?.user.first_name,
    }
}