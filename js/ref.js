
window.addEventListener('load', async () => {
    // referral
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('r')){
        window.location.href = 'airdrop.html?r='+urlParams.get('r');

    }

});
