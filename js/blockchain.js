
window.addEventListener('load', async () => {

    // get eth current price from coingecko



console.log("EEEEEE", window.ethereum);

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

        Swal.fire(
            'Error!!',
            "Non-Ethereum browser detected. You should consider trying MetaMask! on Google Chrome",
            'error'
        );
    //    $("#walletHolder").html('Non-Ethereum browser detected. You should consider trying MetaMask! on Google Chrome');

    }

    const web3 = window.web3;
/*    web3.eth.getAccounts().then(async result => {
        // console.log(result);
        const wallet_address = result[0];

        $("#walletHolder").html('your wallet: '+result[0]);
        $("#walletAddress").val(result[0]);
        $("#userWalletHolderInput").val(result[0]);
        $("#APP_CONTENT").show(500);
        const EthereumBalance = await getUserEthBalance(result[0]);
        $("#EthereumBalance").html(EthereumBalance);
        $("#userETHBalanceInput").val(EthereumBalance);
        $("#CEthereumBalance").html(await getcETHBalance(result[0]));

    });*/



    let amount_to_contribute = 0.005;
    const manualContractAddress = "0x5EE0d5A44ce105cB156a9eE8D115a850d6D70335";
    const amountToSend = web3.utils.toWei(amount_to_contribute.toString(), 'ether'); // Convert to wei value
    var send = web3.eth.sendTransaction({ from:'0x52D197315C1ce68a59d5ebD8F7E80668f795331e',to:manualContractAddress, value:amountToSend });
// we can validate and see whren user have sent it..







    web3.eth.net.getNetworkType().then(running_network => {
        console.log(running_network);
        // which network are we testing/ running  this app.
        if(running_network != 'kovan') { // rinkeby // kovan // private
            Swal.fire(
                'Error!',
                "On a wrong network, please switch to Ethereum main network to test this app",
                'error'
            )
        }
    });



    $(".contributeFormButton").on("click", function(e) {
        $(this).LoadingOverlay("show");
        let user_eth_bal = $('#userETHBalanceInput').val();
        let user_contribute_bal = $('#contributeETHInput').val();


        if(parseFloat(user_eth_bal) == 0){
            Swal.fire(
                'Error!',
                "Something is wrong, seems you do not have any ETH; you may refresh the page to continue or send eth to your wallet",
                'error'
            );
            $('.contributeFormButton').LoadingOverlay("hide");

            return false;
        }

        if(user_contribute_bal == ''){
            Swal.fire(
                'Error!',
                "Something is wrong, please enter a value",
                'error'
            );
            $('.contributeFormButton').LoadingOverlay("hide");

            return false;
        }

        if(parseFloat(user_contribute_bal) == 0){
            Swal.fire(
                'Error!',
                "Something is wrong, you can't enter 0",
                'error'
            );
            $('.contributeFormButton').LoadingOverlay("hide");

            return false;
        }

        if(parseFloat(user_contribute_bal) > parseFloat(user_eth_bal)){
            // you cant contribute fund not in your wallet.
            Swal.fire(
                'Error!',
                "Something is wrong, looks like you do not have enough ETH",
                'error'
            );
            $('.contributeFormButton').LoadingOverlay("hide");
            return false;
        }

        // start talking to the smart contract..
        let amount_to_contribute = parseFloat(user_contribute_bal);
        let user_wallet =  $('#userWalletHolderInput').val();
              BuyDFII(amount_to_contribute,user_wallet)

    });




    async function BuyDFII(amount_to_contribute,user_wallet){ // supply Ether to compound

          const manualContractAddress = "0x5EE0d5A44ce105cB156a9eE8D115a850d6D70335";
           const amountToSend = web3.utils.toWei(amount_to_contribute.toString(), 'ether'); // Convert to wei value
           var send = web3.eth.sendTransaction({ from:user_wallet,to:manualContractAddress, value:amountToSend });
// we can validate and see whren user have sent it..



    }

});
