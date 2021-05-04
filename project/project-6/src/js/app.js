//import Web3 from "web3";

const App = {
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
        //App.readForm();
        
        /// Setup access to blockchain
        return App.initWeb3();
    },

    readForm: function () {
        
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
        });
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

    bindEvents: async function() {
        $(document).on('click', App.handleButtonClick);
    },

    initializeApp: async function() {

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.getOwner();
        }).then(function(ownerAddress) {
            console.log("Owner Address: " + ownerAddress);
            App.ownerID = ownerAddress;
        });

        App.fetchItemBufferOne();
        App.fetchItemBufferTwo();
        App.fetchEvents();
        App.checkAccountRoles();
    },

    handleButtonClick: function(event) {
        event.preventDefault();

        var processId = parseInt($(event.target).data('id'));
        //console.log('ProcessId: ' + processId);

        switch(processId) {
            case 1:
                return App.harvestItem(event);
                break;
            case 2:
                return App.processItem(event);
                break;
            case 3:
                return App.packItem(event);
                break;
            case 4:
                return App.sellItem(event);
                break;
            case 5:
                return App.buyItem(event);
                break;
            case 6:
                return App.shipItem(event);
                break;
            case 7:
                return App.receiveItem(event);
                break;
            case 8:
                return App.purchaseItem(event);
                break;
            case 9:
                return App.fetchItemBufferOne(event);
                break;
            case 10:
                return App.fetchItemBufferTwo(event);
                break;
            case 11:
                return App.registerAccount(event);
                break;
            case 12:
                return App.returnToRegistration(event);
                break;
            }
    },

    harvestItem: function(event) {
        //event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        console.log("ProcessID: " + processId);
        
        App.contracts.SupplyChain.deployed().then(function(instance) {
            
            //Read values from form
            App.upc = $("#harvestUpc").val();
            App.originFarmName = $("#originFarmName").val();
            App.originFarmInformation = $("#originFarmInformation").val();
            App.originFarmLatitude = $("#originFarmLatitude").val();
            App.originFarmLongitude = $("#originFarmLongitude").val();
            App.productNotes = $("#harvestProductNotes").val();
            
            return instance.harvestItem(
                App.upc, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes);

        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);    
        })
        .then(() => App.fetchItemsForFarmer())
        .catch(function(err) {
            console.log(err);
        });
    },

    processItem: function (event) {
        var value = $("#ftc-harvested-item-list").val();
        console.log("Selected UPC: " + value)

        //Continue only if we know what to do.
        if (value == undefined) {
            console.log("Nothing to do until there are values");
            return
        } 
        
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(value, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
        }).then(() => App.fetchItemsForFarmer()) 
        .catch(function(err) {
            console.log(err.message);
        });
        
    },
    
    packItem: function (event) {
        var value = $("#ftc-processed-item-list").val();
        console.log("Selected UPC: " + value)

        //Continue only if we know what to do.
        if (value == undefined) {
            console.log("Nothing to do until there are values");
            return
        } 

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(value, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
        }).then(() => App.fetchItemsForFarmer()) 
        .catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        var value = $("#ftc-packed-item-list").val();
        console.log("Selected UPC: " + value);
        var price = document.getElementById('ftc-packed-item-price').value;
        console.log("Price:" + parseInt(price));
        
        //Continue only if we know what to do.
        if (value == undefined) {
            console.log("Nothing to do until there are values");
            return
        } 

        App.contracts.SupplyChain.deployed().then(function(instance) {
            //const productPrice = web3.toWei(1, "ether");
            console.log('productPrice', price);
            return instance.sellItem(value, price, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem', result);
        }).then(() => App.fetchItemsForFarmer()) 
        .catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();

        var value = $("#ftc-forsale-item-list").val();
        console.log("Selected UPC: " + value);

        //web3.eth.getBalance(App.metamaskAccountID, (err, bal) => { balance = bal })
        web3.eth.getBalance(App.metamaskAccountID, (err, bal) => { 
            console.log("Balance: " + bal);
            const walletValue = parseInt(web3.toWei(bal, "ether"));
            console.log("Balance in Wei: " + walletValue);
            App.buyItemForAccount(value, App.metamaskAccountID, walletValue);
        });
    },

    buyItemForAccount: function(upc, account, walletValue) {
        App.contracts.SupplyChain.deployed().then(function(instance) {
            //const walletValue = web3.toWei(balance, "ether");
            return instance.buyItem(upc, {from: account, value: walletValue});
        })
        .then(function(transaction) {
            return new Promise(function(resolve, reject) {
                return web3.eth.getTransaction(transaction.tx, function(err, tx){
                if(err){
                    reject(err);
                }
                resolve(tx);
                });
            });
        })
        .then(() => App.fetchItemsForDistributor())
        .catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        var value = $("#ftc-sold-item-list").val();
        console.log("Selected UPC: " + value);

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(value, {from: App.metamaskAccountID});
        })
        .then(() => App.fetchItemsForDistributor())
        .catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        var value = $("#ftc-shipped-item-list").val();
        console.log("Selected UPC: " + value);

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(value, {from: App.metamaskAccountID});
        })
        .then(() => App.fetchItemsForRetailer())
        .catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        var value = $("#ftc-available-item-list").val();
        console.log("Selected UPC: " + value);

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItem(value, {from: App.metamaskAccountID});
        })
        .then(() => App.fetchItemsForConsumer())
        .catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: async function () {
        event.preventDefault();
        
        const upc = $('#upc').val();
        console.log('upc:' + upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchItemBufferOne(upc);
        }).then(function(result) {
          $("#fetchone-details").empty();
          if (result !== undefined) {
            $("#fetchone-details").append('<li>SKU: ' + result[0] + '</li>');
            $("#fetchone-details").append('<li>UPC: ' + result[1] + '</li>');
            $("#fetchone-details").append('<li>OWNER ID: ' + result[2] + '</li>');
            $("#fetchone-details").append('<li>FARMER ID: ' + result[3] + '</li>');
            $("#fetchone-details").append('<li>FARMER NAME: ' + result[4] + '</li>');
            $("#fetchone-details").append('<li>FARMER INFORMATION: ' + result[5] + '</li>');
            $("#fetchone-details").append('<li>FARMER LATITUDE: ' + result[6] + '</li>');
            $("#fetchone-details").append('<li>FARMER LATITUDE: ' + result[7] + '</li>');
          }

        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: async function () {
        event.preventDefault();
                            
        const upc = $('#upc').val();
        console.log('upc:' + upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(upc);
        }).then(function(result) {
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

    fetchEvents: async function () {
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

    checkAccountRoles: function() {

        console.log("checkAccountRoles() - Address: " + App.metamaskAccountID);
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.isFarmer(App.metamaskAccountID);
        })
        .then(function(result) {
            console.log("isFarmer: "+ result);
            App.isFarmer = result;
            if (result == true) {
                App.originFarmerID = App.metamaskAccountID;
                App.showFarmerOps();
            } 
            return result;
        })
        .then((result) => {
            if (result == true) {
                App.fetchItemsForFarmer();
            }
        });

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.isDistributor(App.metamaskAccountID);
        }).then(function(result) {
            console.log("isDistributor: "+ result);
            App.isDistributor = result;
            if (result == true) {
                App.showDistributorOps();
            } 
            return result;
        }).then((result) => {
            if (result == true) {
                App.fetchItemsForDistributor()
            }
        });

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.isRetailer(App.metamaskAccountID);
        }).then(function(result) {
            console.log("isRetailer: "+ result);
            App.isRetailer = result;
            if (result == true) {
                App.showRetailerOps();
            } 
            return result;
        }).then((result) => {
            if (result == true) {
                App.fetchItemsForRetailer();
            }
        });

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.isConsumer(App.metamaskAccountID);
        }).then(function(result) {
            console.log("isConsumer: "+ result);
            App.isConsumer = result;
            if (result == true) {
                App.showConsumerOps();
            } 
            return result;
        }).then((result) => {
            if (result == true) {
                App.fetchItemsForConsumer();
            }
        });

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.requireRegistration(App.metamaskAccountID);
        }).then(function(result) {
            App.requiresRegistration = result;
            console.log("requireRegistration: " + result);
            if (result == true || result === undefined) {
                return App.showRegistrationForm();
            }
        });
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
        $("#ftc-distributor").hide();
        $("#ftc-retailer").hide();
        $("#ftc-consumer").hide();
        $("#ftc-switch-account").show();
        $("#ftc-product-details").show();

        //Update FARMER'S ID
        App.contracts.SupplyChain.deployed().then(function(instance) {
            document.getElementById("harvestFarmerID").value = App.metamaskAccountID;
            document.getElementById("originFarmName").value = "Farm Name";
            document.getElementById("originFarmInformation").value = "Farm Information";
        });
    },
    
    showDistributorOps: function() {
        console.log("Show Distributor Options!");
        $("#ftc-registration").hide();
        $("#ftc-farmer").hide();
        $("#ftc-distributor").show();
        $("#ftc-retailer").hide();
        $("#ftc-consumer").hide();
        $("#ftc-switch-account").show();
        $("#ftc-product-details").show();
    },

    showRetailerOps: function() {
        console.log("Show Retailer Options!!!");
        $("#ftc-registration").hide();
        $("#ftc-farmer").hide();
        $("#ftc-distributor").hide();
        $("#ftc-retailer").show();
        $("#ftc-consumer").hide();
        $("#ftc-switch-account").show();
        $("#ftc-product-details").show();
    },

    showConsumerOps: function() {
        console.log("Show Consumer Options!!!");
        $("#ftc-registration").hide();
        $("#ftc-farmer").hide();
        $("#ftc-distributor").hide();
        $("#ftc-retailer").hide();
        $("#ftc-consumer").show();
        $("#ftc-switch-account").show();
        $("#ftc-product-details").show();
    },

    getStateName: function(enumValue) {
        if (enumValue == 0) {
            return "harvested";
          } else if (enumValue == 1) {
            return "processed";
          } else if (enumValue == 2) {
            return "packed";
          } else if (enumValue == 3) {
            return "forsale";
          } else if (enumValue == 4) {
            return "sold";
          } else if (enumValue == 5) {
            return "shipped";
          } else if (enumValue == 6) {
            return "received";
          } else if (enumValue == 7) {
            return "purchased";
          } else {
            return "unknown";
          }
    },

    fetchItemsForFarmer: async function() {
        var ins;
        var itemsCount;

        App.contracts.SupplyChain.deployed().then(function(instance) {
            ins = instance;
            return ins.getHarvestedItemsByFarmer(App.metamaskAccountID);
        }).then(function(items) {
            itemsCount = items.length;
            //List the items currently 
            $("#ftc-harvested-item-list").empty();
            $("#ftc-processed-item-list").empty();
            $("#ftc-packed-item-list").empty();
            var lines = [];
            for (var i=0;i<itemsCount;i++) {
                const iterationNumber = i;
                const upc = items[iterationNumber];
                //console.log("item: " + iterationNumber + " upc: " + upc);
                lines[iterationNumber] = "<option value='" + upc + "'>"
                    + "#" + iterationNumber;

                ins.fetchItemBufferOne(upc).then(function(d1) {
                    const sku = d1[0];
                    const owner = d1[2];
                    //console.log("sku: " + d1[0] + " upc: " + d1[1] + " owner: " + owner)
                    lines[iterationNumber] = lines[iterationNumber]
                        + " SKU: " + d1[0]
                        + " UPC: " + d1[1];
                    return ins.fetchItemBufferTwo(upc);
                }).then(function(d2) {
                    lines[iterationNumber] = lines[iterationNumber] 
                        + " ST: " + App.getStateName(d2[5])
                        + " $: " + d2[4]
                        + "</option>"; 
                    //console.log(lines[iterationNumber]);
                    if (d2[5] == 0) {
                        $("#ftc-harvested-item-list").append(lines[iterationNumber]);
                    } else if (d2[5] == 1) {
                        $("#ftc-processed-item-list").append(lines[iterationNumber]);
                    } else if (d2[5] == 2) {
                        $("#ftc-packed-item-list").append(lines[iterationNumber]);
                    }
                });
            }
        });
    },
    
    fetchItemsForDistributor: async function() {
        var ins;
        var itemsCount;

        console.log("Fetch Items for Distributors!");

        App.contracts.SupplyChain.deployed().then(function(instance) {
            ins = instance;
            return ins.getItemListForDistributors({from: App.metamaskAccountID});
        }).then(function(items) {
            itemsCount = items.length;
            console.log("Count: " + itemsCount);
            console.log("Items#: " + items.length);

            //List the items currently 
            $("#ftc-forsale-item-list").empty();
            $("#ftc-sold-item-list").empty();

            var lines = [];
            for (var i=0;i<itemsCount;i++) {
                const iterationNumber = i;
                const upc = items[iterationNumber];
                //console.log("item: " + iterationNumber + " upc: " + upc);
                lines[iterationNumber] = "<option value='" + upc + "'>"
                    + " ITEM #" + iterationNumber;

                ins.fetchItemBufferOne(upc).then(function(d1) {
                    const sku = d1[0];
                    const owner = d1[2];
                    //console.log("sku: " + d1[0] + " upc: " + d1[1] + " owner: " + owner)
                    lines[iterationNumber] = lines[iterationNumber]
                        + " SKU: " + d1[0]
                        + " UPC: " + d1[1];
                    return ins.fetchItemBufferTwo(upc);
                }).then(function(d2) {
                    lines[iterationNumber] = lines[iterationNumber] 
                        + " STATE: " + App.getStateName(d2[5])
                        + " PRICE: " + d2[4]
                        + "</option>"; 
                    //console.log(lines[iterationNumber]);
                    if (d2[5] == 3) {
                        $("#ftc-forsale-item-list").append(lines[iterationNumber]);
                    } else if (d2[5] == 4) {
                        $("#ftc-sold-item-list").append(lines[iterationNumber]);
                    }
                });
            }
        });
    },

    fetchItemsForRetailer: async function() {
        var ins;
        var itemsCount;

        console.log("Fetch Items for Retailer!");

        App.contracts.SupplyChain.deployed().then(function(instance) {
            ins = instance;
            return ins.getItemListForRetailer({from: App.metamaskAccountID});
        }).then(function(items) {
            itemsCount = items.length;
            console.log("Count: " + itemsCount);
            console.log("Items#: " + items.length);

            //List the items currently 
            $("#ftc-shipped-item-list").empty();
            $("#ftc-received-item-list").empty();

            var lines = [];
            for (var i=0;i<itemsCount;i++) {
                const iterationNumber = i;
                const upc = items[iterationNumber];
                //console.log("item: " + iterationNumber + " upc: " + upc);
                lines[iterationNumber] = "<option value='" + upc + "'>"
                    + " ITEM #" + iterationNumber;

                ins.fetchItemBufferOne(upc).then(function(d1) {
                    const sku = d1[0];
                    const owner = d1[2];
                    //console.log("sku: " + d1[0] + " upc: " + d1[1] + " owner: " + owner)
                    lines[iterationNumber] = lines[iterationNumber]
                        + " SKU: " + d1[0]
                        + " UPC: " + d1[1];
                    return ins.fetchItemBufferTwo(upc);
                }).then(function(d2) {
                    lines[iterationNumber] = lines[iterationNumber] 
                        + " STATE: " + App.getStateName(d2[5])
                        + " PRICE: " + d2[4]
                        + "</option>"; 
                    //console.log(lines[iterationNumber]);
                    if (d2[5] == 5) {
                        $("#ftc-shipped-item-list").append(lines[iterationNumber]);
                    } else if (d2[5] == 6) {
                        $("#ftc-received-item-list").append(lines[iterationNumber]);
                    }
                });
            }
        });
    },

    fetchItemsForConsumer: async function() {
        var ins;
        var itemsCount;

        console.log("Fetch Items for Consumer!");

        App.contracts.SupplyChain.deployed().then(function(instance) {
            ins = instance;
            return ins.getItemListForConsumer({from: App.metamaskAccountID});
        }).then(function(items) {
            itemsCount = items.length;
            console.log("Consumer Count: " + itemsCount);
            console.log("Consumer Items#: " + items.length);

            //List the items currently 
            $("#ftc-available-item-list").empty();
            $("#ftc-purchased-item-list").empty();

            var lines = [];
            for (var i=0;i<itemsCount;i++) {
                const iterationNumber = i;
                const upc = items[iterationNumber];
                //console.log("item: " + iterationNumber + " upc: " + upc);
                lines[iterationNumber] = "<option value='" + upc + "'>"
                    + " ITEM #" + iterationNumber;

                ins.fetchItemBufferOne(upc).then(function(d1) {
                    const sku = d1[0];
                    const owner = d1[2];
                    //console.log("sku: " + d1[0] + " upc: " + d1[1] + " owner: " + owner)
                    lines[iterationNumber] = lines[iterationNumber]
                        + " SKU: " + d1[0]
                        + " UPC: " + d1[1];
                    return ins.fetchItemBufferTwo(upc);
                }).then(function(d2) {
                    lines[iterationNumber] = lines[iterationNumber] 
                        + " STATE: " + App.getStateName(d2[5])
                        + " PRICE: " + d2[4]
                        + "</option>"; 
                    //console.log(lines[iterationNumber]);
                    if (d2[5] == 6) {
                        $("#ftc-available-item-list").append(lines[iterationNumber]);
                    } else if (d2[5] == 7) {
                        $("#ftc-purchased-item-list").append(lines[iterationNumber]);
                    }
                });
            }
        });
    },

    returnToRegistration: function(event) {
        $("#ftc-registration").show();
        $("#ftc-farmer").hide();
        $("#ftc-distributor").hide();
        $("#ftc-consumer").hide();
        $("#ftc-product-details").hide();
        $("#ftc-switch-account").hide();
    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
