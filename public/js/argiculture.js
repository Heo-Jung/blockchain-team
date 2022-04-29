const { web3 } = window
const selectedAddress = web3.eth.defaultAccount

$(document).ready(function() {
    const productRegistryContractAddress = '0x2A76f468622F9f08bb4FE1dafeda596A84Ce1989';
    const productRegistryContractABI = [
		{
			"constant": false,
			"inputs": [
				{
					"name": "_initNumber",
					"type": "uint256"
				},
				{
					"name": "_firstString",
					"type": "string"
				},
				{
					"name": "_secondString",
					"type": "string"
				}
			],
			"name": "addProStru",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "killContract",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "getAllproducts",
			"outputs": [
				{
					"components": [
						{
							"name": "number",
							"type": "uint256"
						},
						{
							"name": "productName",
							"type": "string"
						},
						{
							"name": "location",
							"type": "string"
						},
						{
							"name": "timestamp",
							"type": "uint256"
						}
					],
					"name": "",
					"type": "tuple[]"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "getNumOfProducts",
			"outputs": [
				{
					"name": "",
					"type": "uint8"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "_index",
					"type": "uint256"
				}
			],
			"name": "getProductStruct",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				},
				{
					"name": "",
					"type": "string"
				},
				{
					"name": "",
					"type": "string"
				},
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"name": "productes",
			"outputs": [
				{
					"name": "number",
					"type": "uint256"
				},
				{
					"name": "productName",
					"type": "string"
				},
				{
					"name": "location",
					"type": "string"
				},
				{
					"name": "timestamp",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	]


    $('#linkHome').click(function() { showView("viewHome") });
    $('#linkSubmitDocument').click(function() { showView("viewSubmitDocument"); showTable();  });
    $('#linkVerifyDocument').click(function() { showView("viewVerifyDocument") });
    $('#itemUploadButton').click(itemUploadButton);
    $('#showTableButton').click(showTable);

	
    $('#contractLink').text(productRegistryContractAddress);
    $('#contractLink').attr('href', 'https://ropsten.etherscan.io/address/' + productRegistryContractAddress);
	    
    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }    
    });
    
    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
    }
    
    function showInfo(message) {
        $('#infoBox>p').html(message);
        $('#infoBox').show();
        $('#infoBox>header').click(function(){ $('#infoBox').hide(); });
    }

    function showError(errorMsg) {
        $('#errorBox>p').html("Error: " + errorMsg);
        $('#errorBox').show();
        $('#errorBox>header').click(function(){ $('#errorBox').hide(); });
    }

	async function showTable() {
        // $('#viewSubmitDocument>table').html( );
        // $('#viewSubmitDocument').show();

		if (window.ethereum)
			try {
				await window.ethereum.enable();
			} catch (err) {
                return showError("Access to your Ethereum account rejected.");
			}
		if (typeof web3 === 'undefined')
                return showError("Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.");
		

		let contract = web3.eth.contract(productRegistryContractABI).at(productRegistryContractAddress);


		$('#myTable').append(  '<table>' );

	

		contract.getNumOfProducts(function(err, result) {
			if (err)
				return showError("Smart contract call failed: " + err);
			
				
			// showInfo(`Document ${result} <b>successfully added</b> to the registry.`);
			console.log("length: " + result);

			for (let i = 0; i < result; i++) {

				contract.getProductStruct(i, function(err, product) {

					console.log("product: " + product);

					let toString = product.toString();
					// console.log("product: " + toString);
					let strArray = toString.split(",");

					let timestamp = new Date(strArray[3]*1000);
					console.log("timestamp: " + timestamp);
					console.log("timestamp: " + strArray[3]*1000);

					$('#myTable').append( '<tr><td>' + strArray[0] + ", "+ strArray[1] + ", "+ strArray[2] + ", "+ timestamp  + '</td></tr>' );

				})  // end of get
			} // end of for
		}); 
 		$('#myTable').append(  '</table>' );
    }
    
	function send (){
		if (DEBUG) console.log('send...');
	
		let fromaddress = $("#from").val();	
		let toaddress = productRegistryContractAddress;	
		let amount = $("#howMany").val();
		
		web3.eth.getTransactionCount(fromaddress, (err, txCount) => {
			// Build the transaction
			const txObject = {
			nonce: web3.utils.toHex(txCount),
			to: toaddress,
			value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
			gasLimit: web3.utils.toHex(21000),
			gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
		}
	
		 // Sign the transaction
		 const tx = new ethereumjs.Tx(txObject);
		 tx.sign(privateKey);
	
		 const serializedTx = tx.serialize()
		 const raw = '0x' + serializedTx.toString('hex')
	
		 // Broadcast the transaction
		 web3.eth.sendSignedTransaction(raw, (err, txHash) => {
		console.log('txHash:', txHash)
		  // Now go check etherscan to see the transaction!
		  })
		})  // end of txbuilder
	}


    async function itemUploadButton() {
        // if ($('#documentForUpload')[0].files.length == 0)
            // return showError("Please select a file to upload.");

		if (window.ethereum)
			try {
				await window.ethereum.enable();
			} catch (err) {
                return showError("Access to your Ethereum account rejected.");
			}
		if (typeof web3 === 'undefined')
                return showError("Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.");
	
		send();
    }
});
