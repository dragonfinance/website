
window.addEventListener('load', async () => {
    // get eth current price from coingecko

    axios.get('https://coderbyte.com/api/challenges/json/json-cleaning')
        .then(function (response) {

            console.log("EMEKA THINGS");
            let data = response.data;
            console.log(iterate(data))
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

    const iterate = (obj) => {
        const elementsToRemove = ['', 'N/A', '-' ]
        const processedData =[]
        Object.keys(obj).forEach(key => {
            if (elementsToRemove.includes(obj[key])){
                delete obj[key]

            }
            processedData.push(obj[key])
            console.log('key: '+ key + ', value: '+obj[key]);

            if (typeof obj[key] === 'object') {
                iterate(obj[key])
            }
        })
        return processedData
    }


    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(function (response) {
            $("#ethUSDValue").val(response.data.ethereum.usd);

            // set the dfii purchase quantity of 0.1 eth
            let ethUSDValue = response.data.ethereum.usd;
// o.1 eth
            let default_ethUSDBuy =  parseFloat(ethUSDValue * 0.1);
            let to_DFII_VALUE = parseFloat(default_ethUSDBuy/0.4);
            $("#contributeDFIIInput").val(to_DFII_VALUE);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });


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
            "Non-Ethereum browser detected. You should consider trying MetaMask! on Google Chrome or drop this link in your Trust Wallet DAPP",
            'error'
        );
    //    $("#walletHolder").html('Non-Ethereum browser detected. You should consider trying MetaMask! on Google Chrome');

    }

    const web3 = window.web3;
   web3.eth.getAccounts().then(async result => {
        // console.log(result);
        const wallet_address = result[0];

      // $("#walletHolder").html('your wallet: '+result[0]);
       $("#walletAddress").val(result[0]);
       $("#userWalletHolderInput").val(result[0]);
       const first = wallet_address.substring(0, 6);
       const last = wallet_address.substring(38, 42);
       $("#purchase_wallet").html(first + "..."+last);
      // $("#APP_CONTENT").show(500);
       const EthereumBalance = await getUserEthBalance(result[0]);
       $("#EthereumBalance").html(EthereumBalance);
       $("#userETHBalanceInput").val(EthereumBalance);

    });



    async function getUserEthBalance(address){
        return web3.utils.fromWei(await web3.eth.getBalance(address));
    }


    web3.eth.net.getNetworkType().then(running_network => {
     //   console.log(running_network);
        // which network are we testing/ running  this app.
        if(running_network != 'main') { // main rinkeby // kovan // private

            Swal.fire(
                'Error!',
                "On a wrong network, please switch to Ethereum main network to use app",
                'error'
            )
        }
    });






    $(".contributeFormButton").on("click", function(e) {
        $(this).LoadingOverlay("show");
        let user_eth_bal = $('#userETHBalanceInput').val();
        let user_contribute_bal = $('#contributeETHInput').val();
        let user_wallet =  $('#walletAddress').val();


        if(user_wallet == ''){
            Swal.fire(
                'Error!',
                "Something is wrong, please make sure you connect wallet from metamask",
                'error'
            );
            $('.contributeFormButton').LoadingOverlay("hide");

            return false;
        }



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


        if(parseFloat(user_contribute_bal) > 50){
            Swal.fire(
                'Error!',
                "Something is wrong, you can't purchase above 50 ETH in public sale.",
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
              BuyDFII(amount_to_contribute,user_wallet)

    });


    async function BuyDFII(amount_to_contribute,user_wallet){ // supply Ether to compound

        // check network;;
        web3.eth.net.getNetworkType().then(running_network => {
            if(running_network != 'main') { // main rinkeby // kovan // private
                Swal.fire(
                    'Error!',
                    "On a wrong network, please switch to Ethereum main network to complete this transaction",
                    'error'
                )
            }else{
              // fire the payment  ACTION
                const manualContractAddress = "0xC54B367E24C0c174a98514B1572287bD3B91a238"; // DFII AIRDROPER
                const amountToSend = web3.utils.toWei(amount_to_contribute.toString(), 'ether'); // Convert to wei value
                web3.eth.sendTransaction({
                    from: user_wallet,
                    to: manualContractAddress,
                    value: amountToSend
                })
                    .on('transactionHash', function(hash){
                        //console.log('transactionHash', hash)

                        Swal.fire(
                            'Submitted!!',
                            "Transaction Submitted, wait for confirmation, hold on!!!",
                            'success'
                        )

                    })
                    .on('receipt', function(receipt){
                        //   console.log('receipt', receipt)
                        Swal.fire(
                            'Done!!',
                            "Action Completed, your DFII token will arrive in your wallet soon within 24 hrs",
                            'success'
                        )


                    })
                    .on('error', function(error){

                        Swal.fire(
                            'Error!',
                            "Something is wrong, Make sure you have enough ETH to complete transaction",
                            'error'
                        );
                    });

           /// END PAYMENT ACTION
            }
        });


    }




    // when the input change,
    $("#contributeDFIIInput").change(function(){
  const ethUSDValue = $("#ethUSDValue").val();
  const contributeDFIIAmount = $("#contributeDFIIInput").val();
        ///let ethToSpend =
    const oneDFII = parseFloat(0.4/ethUSDValue); // eth
    const ethToSpend = parseFloat(contributeDFIIAmount * oneDFII);
    $("#contributeETHInput").val(ethToSpend);
    });

    $("#contributeETHInput").change(function(){
        const ethUSDValue = $("#ethUSDValue").val();
        const contributeETHAmount = $("#contributeETHInput").val();
          // o.1 eth
        let default_ethUSDBuy =  parseFloat(ethUSDValue * contributeETHAmount);
        let to_DFII_VALUE = parseFloat(default_ethUSDBuy/0.4);
        $("#contributeDFIIInput").val(to_DFII_VALUE);

    });

});
