var ENDPOINT = 'http://127.0.0.1:3000/api/transactions';

var cache = null;


function normalise(record) {
    return {
        transactionId: record.transaction_id || record.transactionId,
        booth: record.booth_code || record.booth,
        location: record.location || WINA.locationOf(record.booth_code || record.booth),
        service: record.service_name || record.service,
        revenuePerKwacha: Number(
            record.rate !== undefined
                ? record.rate
                : record.revenuePerKwacha
        ),
        transactionAmount: Number(record.transaction_amount || record.transactionAmount)
    };
}


function loadTransactions(callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', ENDPOINT, true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                var rows = JSON.parse(xhr.responseText);

                var transactions = rows.map(normalise);

                cache = transactions;

                callback(null, {
                    source: 'network',
                    transactions: transactions
                });

            } catch (error) {
                callback(error);
            }

        } else {
            callback(new Error('Failed to load transactions from server.'));
        }
    };

    xhr.onerror = function () {
        callback(new Error('Could not connect to the Wina Bwangu server.'));
    };

    xhr.send();
}


function saveTransaction(draft, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', ENDPOINT, true);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                var response = JSON.parse(xhr.responseText);

                var transaction = normalise({
                    transaction_id: response.transactionId,
                    booth_code: response.boothCode,
                    service_name: response.serviceName,
                    rate: response.rate,
                    transaction_amount: response.transactionAmount,
                    location: WINA.locationOf(response.boothCode)
                });

                if (cache) {
                    cache.push(transaction);
                }

                callback(null, transaction);

            } catch (error) {
                callback(error);
            }

        } else {
            var message = 'Failed to save transaction.';

            try {
                var errorResponse = JSON.parse(xhr.responseText);

                if (errorResponse.message) {
                    message = errorResponse.message;
                }
            } catch (error) {
                // Keep the default message.
            }

            callback(new Error(message));
        }
    };

    xhr.onerror = function () {
        callback(new Error('Could not connect to the Wina Bwangu server.'));
    };

    xhr.send(JSON.stringify({
        boothCode: draft.booth,
        serviceName: draft.service,
        transactionAmount: Number(draft.transactionAmount)
    }));
}


function nextTransactionId(transactions) {
    var highest = 0;

    transactions.forEach(function (transaction) {
        var id = transaction.transactionId || '';

        if (id.indexOf('WB') === 0) {
            var number = parseInt(id.substring(2), 10);

            if (!isNaN(number) && number > highest) {
                highest = number;
            }
        }
    });

    return 'WB' + String(highest + 1).padStart(7, '0');
}


window.WinaAPI = {
    loadTransactions: loadTransactions,
    saveTransaction: saveTransaction,
    nextTransactionId: nextTransactionId
};
