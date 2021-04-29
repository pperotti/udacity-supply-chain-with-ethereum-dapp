App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        
        /// Setup access to blockchain
        return App.initWeb3();
    },

    readForm: function () {
        /*
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();
        */

        console.log("App.sku: " + App.sku);
        console.log("App.upc: " + App.upc);
        console.log("App.metamaskAddress: " + App.metamaskAccountID);
        console.log("App.ownerID: " + App.ownerID);
        console.log("App.originFarmerID: " + App.originFarmerID);
        console.log("App.originFarmName: " + App.originFarmName);
        console.log("App.originFarmInformation: " + App.originFarmInformation);
        console.log("App.originFarmLatitude: " + App.originFarmLatitude);
        console.log("App.originFarmLongitude: " + App.originFarmLongitude);
        console.log("App.productNotes: " + App.productNotes);
        console.log("App.productPrice: " + App.productPrice);
        console.log("App.distributorID: " + App.distributorID);
        console.log("App.retailerID: " + App.retailerID);
        console.log("App.consumerID: " + App.consumerID);
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        }

        App.getMetaMaskAccountID();

        return App.initSupplyChain();
    },

    getMetaMaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetamaskID:' + res[0]);
            App.metamaskAccountID = res[0];

            $("#metamask-address").text("Address: " + res[0]);
        })
    },

    initSupplyChain: async function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.initializeApp();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
        $(document).on('FarmerResult', App.farmerInfo);
    },

    initializeApp: function() {
        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
        App.fetchEvents();
        App.checkAccountRoles();
        App.fetchItemsForCurrentAddress();
    },

    farmerInfo: async function(event) {
        event.preventDefault();
        console.log("Info" + event);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaMaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId: ' + processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                return await App.registerAccount(event);
                break;
            }
    },

    harvestItem: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.harvestItem(
                App.upc, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyItem(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc:' + App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
            App.SupplyChain = instance;
            return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          //$("#ftc-item").text(result);
          //console.log('fetchItemBufferOne: ' + result);
          $("#fetchone-details").empty();
          if (result !== undefined) {
            $("#fetchone-details").append('<li>SKU: ' + App.sku + '</li>');
            $("#fetchone-details").append('<li>UPC: ' + App.upc + '</li>');
            $("#fetchone-details").append('<li>OWNER ID: ' + App.ownerID + '</li>');
            $("#fetchone-details").append('<li>FARMER ID: ' + App.originFarmerID + '</li>');
            $("#fetchone-details").append('<li>FARMER NAME: ' + App.originFarmName + '</li>');
            $("#fetchone-details").append('<li>FARMER INFORMATION: ' + App.originFarmInformation + '</li>');
            $("#fetchone-details").append('<li>FARMER LATITUDE: ' + App.originFarmLatitude + '</li>');
            $("#fetchone-details").append('<li>FARMER LATITUDE: ' + App.originFarmLongitude + '</li>');
          }

        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          //$("#ftc-item").text(result);
          //console.log('fetchItemBufferTwo', result);
          $("#fetchtwo-details").empty();
          if (result !== undefined) {
            $("#fetchtwo-details").append('<li>SKU: ' + result[0] + '</li>');
            $("#fetchtwo-details").append('<li>UPC: ' + result[1] + '</li>');
            $("#fetchtwo-details").append('<li>PRODUCT ID: ' + result[2] + '</li>');
            $("#fetchtwo-details").append('<li>PRODUCT NOTES: ' + result[3] + '</li>');
            $("#fetchtwo-details").append('<li>PRODUCT PRICE: ' + result[4] + '</li>');
            $("#fetchtwo-details").append('<li>ITEM STATE: ' + result[5] + '</li>');
            $("#fetchtwo-details").append('<li>DISTRIBUTOR ID: ' + result[6] + '</li>');
            $("#fetchtwo-details").append('<li>RETAILER ID: ' + result[7] + '</li>');
            $("#fetchtwo-details").append('<li>CONSUMER ID: ' + result[8] + '</li>');
          }
          
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });  
    },

    checkAccountRoles: async function() {

        console.log("checkAccountRoles() - Address: " + App.metamaskAccountID);

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.isFarmer(App.metamaskAccountID);
        }).then(function(result) {
            console.log("isFarmer: "+ result);
            App.isFarmer = result;
            if (result == true) {
                App.showFarmerOps();
            }
          }
        )
/*
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.isDistributor(App.metamaskAccountID);
        }).then(function(result) {
            App.isDistributor = result;
            if (result == true) {
                return App.showDistributorOps();
            }
            console.log("isDistributor: "+ result);
        });

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.isRetailer(App.metamaskAccountID);
        }).then(function(result) {
            App.isRetailer = result;
            if (result == true) {
                return App.showRetailerOps();
            }
            console.log("isRetailer: "+ result);
        });

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.isConsumer(App.metamaskAccountID);
        }).then(function(result) {
            App.isConsumer = result;
            if (result == true) {
                return App.showConsumerOps();
            }
            console.log("isConsumer: "+ result);
        });

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.requireRegistration(App.metamaskAccountID);
        }).then(function(result) {
            App.isConsumer = result;
            if (result == true || result === undefined) {
                return App.showRegistrationForm();
            }
            console.log("requireRegistration: "+ result);
        });
*/
    },

    registerAccount: async function() {
        const role = $('#role').val();

        const sc = await App.contracts.SupplyChain.deployed();
        sc.getSender().then(function(res) {
            console.log("Sender: " + res);
        });
        console.log("Role: " + role);
        if (role == 0) {
            return sc.addFarmer(App.metamaskAccountID, {from: App.metamaskAccountID})
            .then(() => App.showFarmerOps(sc))
            .catch(function(err) {
                console.log(err);
            });
        } else if (role == 1) {
            sc.addDistributor(App.metamaskAccountID, {from: App.metamaskAccountID}).then(function() {
                App.showDistributorOps();
            }).catch(function(err) {
                console.log(err);
            });
        } else if (role == 2) {
            sc.addRetailer(App.metamaskAccountID, {from: App.metamaskAccountID}).then(function() {
                App.showRetailerOps();
            }).catch(function(err) {
                console.log(err);
            });
        } else if (role == 3) {
            sc.addConsumer(App.metamaskAccountID, {from: App.metamaskAccountID}).then(function() {
                App.showConsumerOps();
            }).catch(function(err) {
                console.log(err);
            });
        }
    },

    showRegistrationForm: function() {
        console.log("Show Registration Form!");
        $("#ftc-registration").show();
    },

    showFarmerOps: function() {
        console.log("Show Farmer Options!");
        $("#ftc-registration").hide();
        $("#ftc-farmer").show();

        //Update FARMER'S ID
        document.getElementById("harvestFarmerID").value = App.metamaskAccountID;
        document.getElementById("originFarmName").value = "Farm Name";
        document.getElementById("originFarmInformation").value = "Farm Information";
        
        return App.contracts.SupplyChain.deployed();

        //Get some data
        /*
        App.contracts.SupplyChain.deployed().then(function(instance) {
            const sku = instance.getSku.call();
            console.log("lastSku: " + sku); 
            /*instance.getSku().then(function(result) {
                console.log("lastSku: " + result);        
                document.getElementById("harvestSku").value = result;
            })
            *7
            /*
            const nextSku = instance.getSku();
            const nextUpc = instance.getUpc();

            console.log("lastSku: " + nextSku);
            console.log("nextUpc: " + nextUpc);
        
            document.getElementById("harvestSku").value = nextSku;
            document.getElementById("harvestUpc").value = nextUpc;* /
        });*/
    },

    showDistributorOps: function() {
        console.log("Show Distributor Options!");
        $("#ftc-registration").hide();
        $("#ftc-distributor").show();
    },

    showRetailerOps: function() {
        console.log("Show Retailer Options!!!");
        $("#ftc-registration").hide();
        $("#ftc-retailer").show();
    },

    showConsumerOps: function() {
        console.log("Show Consumer Options!!!");
        $("#ftc-registration").hide();
        $("#ftc-consumer").show();
    },

    fetchItemsForCurrentAddress: function() {
        //const sc = await App.contracts.SupplyChain.deployed();
        //const itemsByFarmer = sc.getHarvestedItemsByFarmer(App.metamaskAccountID);
        
        var ins;

        App.contracts.SupplyChain.deployed().then(function(instance) {
            ins = instance;
            return ins.getAAA.call();
            //return ins.getHarvestedItemsCount(App.metamaskAccountID);
            //return instance.getHarvestedItemsByFarmer(App.metamaskAccountID);
        }).then(function(count) {
            console.log("item count: " + count);
        });

            /*
            //List the items currently 
            $("ftc-harvested-item-list").empty();
            for (i=0;i<itemsByFarmer.length;i++) {

                const upc = itemsByFarmer[i];
                const d1 = sc.fetchItemBufferOne(upc);
                const d2 = sc.fetchItemBufferOne(upc);

                $("ftc-harvested-item-list").append(
                    "<li>" +
                    "SKU: " + d1[0] +
                    "UPC: " + d1[1] +
                    "OWNER ID: " + d1[2] + 
                    "DISTRIBUTOR ID: " + d2[6] + 
                    "RETAILER ID: " + d2[7] + 
                    "CONSUMER ID: " + d2[8] + 
                    "</li>"
                );
            }*/
        //});

    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
