
window.addEventListener('load', async () => {
    // referral
    const urlParams = new URLSearchParams(window.location.search);
    const inviter_address = urlParams.get('r');
    $("#inviterETHWalletInput").val(inviter_address);

    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            let eeet = await  ethereum.enable();
        } catch (error) {
            // User denied account access...
            Swal.fire(
                'Error!',
                "Something is wrong, Denying account access will not let you use this app.",
                'error'
            )


        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        // web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        // console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Non-Ethereum browser detected. You should consider trying MetaMask! on Google Chrome or drop this link in your Trust Wallet DAPP',
            footer: '<a href="https://link.trustwallet.com/open_url?url=https://dragonfinance.net/airdrop.html">Open With Trust Wallet on mobile?</a>'
        })
        //    $("#walletHolder").html('Non-Ethereum browser detected. You should consider trying MetaMask! on Google Chrome');

    }

    const web3 = window.web3;
      web3.eth.getAccounts().then(async result => {
            // console.log(result);
            $("#userWalletAddress").html(result[0]);
            $("#userETHWalletInput").val(result[0]);
            $("#ReferalLinkMain").html('https://dragonfinance.net?r='+result[0]);
            $("#myCopyText").val('https://dragonfinance.net?r='+result[0]);
        });


    $("#Fill_Referal_fORM").on("click", function(e) {
        $(this).LoadingOverlay("show");
        let user_eth_wallet = $('#userETHWalletInput').val();
        let inviter_eth_wallet = $('#inviterETHWalletInput').val();
        // redirect to google form
        window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfP3YJaszt-Hw2SlVixzTDb2fpigkz3OlGVJmJiW_s70g647Q/viewform?usp=pp_url&entry.2005620554='+user_eth_wallet+'&entry.502164729='+inviter_eth_wallet;
    });




});
