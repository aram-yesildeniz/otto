'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.footerUserLogin = (() => {
    function setLoginIcon (userData) {
        const loginAreaIcon = document.getElementsByClassName('sp_loginAreaIcon')[0];
        switch (userData.salutation) {
            case 'MS':
                loginAreaIcon.innerText = '♀';
                break;
            case 'MR':
                loginAreaIcon.innerText = '♂';
                break;
            default:
                loginAreaIcon.innerText = 'Θ';
        }
    }

    function setName (userData) {
        if (typeof userData.firstName === 'undefined' && typeof userData.lastName === 'undefined') {
            if (typeof userData.email !== 'undefined') {
                document.getElementsByClassName('sp_loginAreaMyNameOrLogin')[0].innerText = userData.email;
            }
        } else {
            document.getElementsByClassName(
                'sp_loginAreaMyNameOrLogin')[0].innerText = `${userData.firstName} ${userData.lastName}`;
        }
    }

    function setSoftLoggedOut (userData) {
        const notMyName = document.getElementsByClassName('sp_loginAreaNotMyName')[0];
        if (typeof userData.firstName === 'undefined' && typeof userData.lastName === 'undefined') {
            notMyName.innerText = '(Anonym weiter surfen)';
        } else {
            notMyName.innerText = 'Das bin ich nicht';
        }
        notMyName.href = userData.notMyNameLink;
        notMyName.style.display = '';
    }

    function setLoggedIn () {
        const badge = document.getElementsByClassName('sp_loginAreaIconBadge')[0];
        badge.style.display = 'inline';
        badge.innerText = '!';
        const link = document.getElementsByClassName('sp_loginIcon')[0];
        link.className += ' sp_loggedIn';
    }

    function displayUserInformation (userData) {
        const links = document.getElementsByClassName('sp_loginFooterLink');
        for (let index = 0; index < links.length; index++) {
            links[index].href = userData.link;
        }
        if (userData.loginState === 'unknownVisitor') {
            document.getElementsByClassName('sp_loginAreaIcon')[0].innerText = 'Θ';
            document.getElementsByClassName('sp_loginAreaMyNameOrLogin')[0].innerText = 'Anmelden';
        } else {
            if (userData.loginState === 'loggedIn') {
                setLoggedIn();
            } else {
                setSoftLoggedOut(userData);
            }
            setName(userData);
            setLoginIcon(userData);
        }
    }

    function loadUserData () {
        const loginFooterArea = document.getElementsByClassName('sp_loginFooterArea')[0];
        if (typeof loginFooterArea !== 'undefined' && !loginFooterArea.getAttribute('data-initialized')) {
            o_util.ajax.getJSON('/user/public/loginState/footer').then((xhr) => {
                if (xhr.status === 200) {
                    loginFooterArea.setAttribute('data-initialized', true);
                    displayUserInformation(xhr.responseJSON);
                }
            });
        }
    }

    return {
        loadUserData,
        displayUserInformation
    };
})();

o_global.eventLoader.onLoad(100, () => {
    o_shoppages.footerUserLogin.loadUserData();
});
